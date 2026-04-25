"""Pytest fixtures.

Integration tests hit a REAL Postgres — never a SQLite stand-in — because the
schema uses JSONB and the prod migrations would lie otherwise (see
CLAUDE.md: "never use mock data"). Locally the test DB is the same docker
compose Postgres; in CI it's a service container on each job.

The test DB URL is controlled by the TEST_DATABASE_URL env var with a
reasonable default. Every test runs inside a nested transaction that is
rolled back at teardown, so tests are fully isolated without per-test
TRUNCATEs.
"""

from __future__ import annotations

import os
from collections.abc import AsyncIterator

import pytest_asyncio
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# Force development mode + a test-safe Sentry config BEFORE importing the app.
os.environ.setdefault("ENVIRONMENT", "development")
os.environ.setdefault("SENTRY_DSN", "")
os.environ.setdefault("LOG_JSON", "false")
os.environ.setdefault(
    "DATABASE_URL",
    os.environ.get(
        "TEST_DATABASE_URL",
        "postgresql+asyncpg://wadecv:wadecv@localhost:5432/wadecv_test",
    ),
)

from app.database import Base, get_db
from app.main import app


@pytest_asyncio.fixture(loop_scope="session", scope="session")
async def engine():
    eng = create_async_engine(os.environ["DATABASE_URL"], echo=False, pool_pre_ping=True)
    async with eng.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield eng
    async with eng.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await eng.dispose()


@pytest_asyncio.fixture(loop_scope="session")
async def session(engine) -> AsyncIterator[AsyncSession]:
    connection = await engine.connect()
    trans = await connection.begin()
    session_maker = async_sessionmaker(bind=connection, expire_on_commit=False)
    async with session_maker() as s:
        yield s
    await trans.rollback()
    await connection.close()


@pytest_asyncio.fixture(loop_scope="session")
async def client(session: AsyncSession) -> AsyncIterator[AsyncClient]:
    """HTTPX client wired to the FastAPI app with a scoped test DB session."""

    async def _override_get_db() -> AsyncIterator[AsyncSession]:
        yield session

    app.dependency_overrides[get_db] = _override_get_db
    async with LifespanManager(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            yield ac
    app.dependency_overrides.clear()


@pytest_asyncio.fixture(loop_scope="session")
async def authed_user(session: AsyncSession):
    """Create a real user row + access token. Returns (user, access_token)."""
    from app.models.credit import CreditTransaction
    from app.models.user import User
    from app.utils.auth import create_access_token, hash_password

    # Use @example.com (IANA reserved) so pydantic EmailStr accepts it across
    # email-validator versions — .test / .local can be rejected by stricter releases.
    user = User(
        email=f"user-{os.urandom(4).hex()}@example.com",
        password_hash=hash_password("correct-horse-battery-staple"),
        email_verified=True,
        credits=5,
    )
    session.add(user)
    await session.flush()
    session.add(CreditTransaction(user_id=user.id, amount=5, type="test_seed", description="seed"))
    await session.flush()
    return user, create_access_token(str(user.id))

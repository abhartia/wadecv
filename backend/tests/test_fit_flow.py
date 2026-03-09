import uuid

import pytest
from httpx import AsyncClient

from app.main import app
from app.models.user import User
from app.models.cv import CV
from app.database import async_session_maker


@pytest.mark.asyncio
async def test_fit_creates_cv_job_and_charges_credit(monkeypatch):
    # Seed a user with base CV content and some credits.
    async with async_session_maker() as session:
        user = User(
            email="fit-test@example.com",
            hashed_password="test",
            credits=5,
            base_cv_content="Test CV content",
        )
        session.add(user)
        await session.flush()
        user_id = user.id

        # Ensure there is no existing CV for this user.
        await session.commit()

    # Authenticate by monkeypatching dependency to always return our user.
    from app.utils import auth as auth_utils

    async def fake_get_current_user():
        async with async_session_maker() as session:
            db_user = await session.get(User, user_id)
            assert db_user is not None
            return db_user

    monkeypatch.setattr(auth_utils, "get_current_user", fake_get_current_user)

    async with AsyncClient(app=app, base_url="http://testserver") as client:
        # Run fit analysis with only a job_description.
        response = await client.post(
            "/api/cv/fit",
            json={
                "job_description": "Software engineer role working across the stack.",
                "page_limit": 1,
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"]
        assert data["job_id"]
        assert data["fit_analysis"] is not None
        assert data["generated_cv_data"] is None

    # Verify that one credit was deducted and a CV row was created.
    async with async_session_maker() as session:
        db_user = await session.get(User, user_id)
        assert db_user is not None
        assert db_user.credits == 4

        cv_id = uuid.UUID(data["id"])
        cv = await session.get(CV, cv_id)
        assert cv is not None
        assert cv.fit_analysis is not None


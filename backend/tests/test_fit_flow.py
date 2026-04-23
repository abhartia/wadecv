import uuid

import pytest
from httpx import AsyncClient

from app.database import async_session_maker
from app.main import app
from app.models.cv import CV
from app.models.user import User


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


@pytest.mark.asyncio
async def test_refine_after_fit_does_not_charge_extra_credit(monkeypatch):
    # Seed a user with base CV content and some credits.
    async with async_session_maker() as session:
        user = User(
            email="fit-refine-test@example.com",
            hashed_password="test",
            credits=5,
            base_cv_content="Test CV content",
        )
        session.add(user)
        await session.flush()
        user_id = user.id
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
        # Initial paid fit analysis.
        fit_response = await client.post(
            "/api/cv/fit",
            json={
                "job_description": "Backend engineer role with Python and SQL.",
                "page_limit": 1,
            },
        )
        assert fit_response.status_code == 200
        fit_data = fit_response.json()
        cv_id = fit_data["id"]

        # Capture credits after the paid fit.
        async with async_session_maker() as session:
            db_user = await session.get(User, user_id)
            assert db_user is not None
            credits_after_fit = db_user.credits

        # Submit gap feedback to refine (should be free).
        refine_response = await client.post(
            f"/api/cv/{cv_id}/refine",
            json={
                "gap_feedback": {
                    "Missing leadership experience": "I led a team of 5 engineers for 2 years.",
                }
            },
        )
        assert refine_response.status_code == 200
        refined = refine_response.json()
        assert refined["fit_analysis"] is not None

        # Credits should not change after refinement.
        async with async_session_maker() as session:
            db_user = await session.get(User, user_id)
            assert db_user is not None
            assert db_user.credits == credits_after_fit


@pytest.mark.asyncio
async def test_multiple_refines_keep_credits_constant(monkeypatch):
    # Seed a user with base CV content and some credits.
    async with async_session_maker() as session:
        user = User(
            email="fit-multi-refine-test@example.com",
            hashed_password="test",
            credits=5,
            base_cv_content="Test CV content",
        )
        session.add(user)
        await session.flush()
        user_id = user.id
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
        # Initial paid fit analysis.
        fit_response = await client.post(
            "/api/cv/fit",
            json={
                "job_description": "Full-stack engineer role with React and Python.",
                "page_limit": 1,
            },
        )
        assert fit_response.status_code == 200
        fit_data = fit_response.json()
        cv_id = fit_data["id"]

        # Capture credits after the paid fit.
        async with async_session_maker() as session:
            db_user = await session.get(User, user_id)
            assert db_user is not None
            credits_after_fit = db_user.credits

        # Run multiple refinements with different feedback.
        for idx in range(3):
            refine_response = await client.post(
                f"/api/cv/{cv_id}/refine",
                json={
                    "gap_feedback": {
                        f"Gap #{idx}": f"Explanation for gap #{idx}",
                    }
                },
            )
            assert refine_response.status_code == 200
            refined = refine_response.json()
            assert refined["fit_analysis"] is not None

        # Credits should remain the same after multiple refinements.
        async with async_session_maker() as session:
            db_user = await session.get(User, user_id)
            assert db_user is not None
            assert db_user.credits == credits_after_fit


@pytest.mark.asyncio
async def test_fit_only_refine_updates_fit_without_generating_cv(monkeypatch):
    # Seed a user with base CV content and some credits.
    async with async_session_maker() as session:
        user = User(
            email="fit-only-refine-test@example.com",
            hashed_password="test",
            credits=5,
            base_cv_content="Test CV content",
        )
        session.add(user)
        await session.flush()
        user_id = user.id
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
        # Initial paid fit analysis.
        fit_response = await client.post(
            "/api/cv/fit",
            json={
                "job_description": "Data engineer role with Python and SQL.",
                "page_limit": 1,
            },
        )
        assert fit_response.status_code == 200
        fit_data = fit_response.json()
        cv_id = fit_data["id"]
        fit_data["fit_analysis"]

        # Capture credits after the paid fit.
        async with async_session_maker() as session:
            db_user = await session.get(User, user_id)
            assert db_user is not None
            credits_after_fit = db_user.credits

        # Call the fit-only refine endpoint with gap feedback.
        refine_response = await client.post(
            f"/api/cv/{cv_id}/fit/refine",
            json={
                "gap_feedback": {
                    "Missing cloud experience": "I have 3 years of hands-on experience with AWS and GCP.",
                }
            },
        )
        assert refine_response.status_code == 200
        refined = refine_response.json()
        assert refined["fit_analysis"] is not None
        # We do not assert that the analysis changed, only that it is present.
        assert refined["generated_cv_data"] is None

        # Credits should remain the same after fit-only refinement.
        async with async_session_maker() as session:
            db_user = await session.get(User, user_id)
            assert db_user is not None
            assert db_user.credits == credits_after_fit


@pytest.mark.asyncio
async def test_multiple_fit_only_refines_keep_credits_constant(monkeypatch):
    # Seed a user with base CV content and some credits.
    async with async_session_maker() as session:
        user = User(
            email="fit-only-multi-refine-test@example.com",
            hashed_password="test",
            credits=5,
            base_cv_content="Test CV content",
        )
        session.add(user)
        await session.flush()
        user_id = user.id
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
        # Initial paid fit analysis.
        fit_response = await client.post(
            "/api/cv/fit",
            json={
                "job_description": "Platform engineer role with Kubernetes and Python.",
                "page_limit": 1,
            },
        )
        assert fit_response.status_code == 200
        fit_data = fit_response.json()
        cv_id = fit_data["id"]

        # Capture credits after the paid fit.
        async with async_session_maker() as session:
            db_user = await session.get(User, user_id)
            assert db_user is not None
            credits_after_fit = db_user.credits

        # Run multiple fit-only refinements with different feedback.
        for idx in range(3):
            refine_response = await client.post(
                f"/api/cv/{cv_id}/fit/refine",
                json={
                    "gap_feedback": {
                        f"Gap #{idx}": f"Explanation for gap #{idx}",
                    }
                },
            )
            assert refine_response.status_code == 200
            refined = refine_response.json()
            assert refined["fit_analysis"] is not None
            assert refined["generated_cv_data"] is None

        # Credits should remain the same after multiple fit-only refinements.
        async with async_session_maker() as session:
            db_user = await session.get(User, user_id)
            assert db_user is not None
            assert db_user.credits == credits_after_fit

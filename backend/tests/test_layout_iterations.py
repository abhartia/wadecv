from typing import Any

import pytest

from app.models.cv import CV
from app.models.job import Job
from app.models.user import User
from app.routers.cv import _apply_layout_feedback_and_regenerate


class DummyEmit:
    def __init__(self) -> None:
        self.events: list[dict[str, Any]] = []

    async def __call__(self, event) -> None:  # type: ignore[no-untyped-def]
        self.events.append(event.model_dump())


@pytest.mark.asyncio
async def test_layout_iteration_stops_when_within_page_limit(monkeypatch):
    user = User(id=None)  # type: ignore[arg-type]
    cv = CV(id=None, user_id=None, original_filename="x", original_content="y")  # type: ignore[arg-type]
    job = Job(id=None, user_id=None, cv_id=None, job_description="desc")  # type: ignore[arg-type]
    cv.jobs = [job]  # type: ignore[assignment]

    cv_data_first = {"data": 1}

    # First call: too many pages, returns one tweak; second call: within limit.
    layout_calls: list[dict[str, Any]] = []

    async def fake_get_cv_layout_feedback(
        cv_data: dict, page_limit: int = 1, user_id: str | None = None, cv_id: str | None = None
    ) -> list[str]:
        layout_calls.append({"cv_data": cv_data, "page_limit": page_limit})
        return ["shorten summary"]

    def fake_count_cv_pdf_pages(cv_data: dict, page_limit: int = 1) -> int:
        # First regenerated CV still overflows; second one fits.
        if cv_data.get("iteration") == 1:
            return page_limit + 1
        return page_limit

    async def fake_generate_cv(**kwargs):  # type: ignore[no-untyped-def]
        base = kwargs.get("cv_data") or {}
        iteration = base.get("iteration", 0) + 1
        return {"iteration": iteration}

    monkeypatch.setattr("app.routers.cv.get_cv_layout_feedback", fake_get_cv_layout_feedback)
    monkeypatch.setattr("app.routers.cv.count_cv_pdf_pages", fake_count_cv_pdf_pages)
    monkeypatch.setattr("app.routers.cv.generate_cv", fake_generate_cv)

    emitter = DummyEmit()

    result = await _apply_layout_feedback_and_regenerate(
        cv_data=cv_data_first,
        original_content="orig",
        job_description="desc",
        additional_info=None,
        page_limit=1,
        user=user,
        cv=cv,
        emit=emitter,
        job=job,
        progress=70,
        max_layout_iterations=3,
    )

    # We expect two generate_cv calls (iteration 1 and 2) and final result to have iteration==2
    assert result["iteration"] == 2


@pytest.mark.asyncio
async def test_layout_iterations_respect_max_iterations(monkeypatch):
    user = User(id=None)  # type: ignore[arg-type]
    cv = CV(id=None, user_id=None, original_filename="x", original_content="y")  # type: ignore[arg-type]
    job = Job(id=None, user_id=None, cv_id=None, job_description="desc")  # type: ignore[arg-type]
    cv.jobs = [job]  # type: ignore[assignment]

    cv_data_first = {"data": 1}

    async def fake_get_cv_layout_feedback(
        cv_data: dict, page_limit: int = 1, user_id: str | None = None, cv_id: str | None = None
    ) -> list[str]:
        return ["shorten summary"]

    def fake_count_cv_pdf_pages(cv_data: dict, page_limit: int = 1) -> int:
        # Always overflow to force hitting max_layout_iterations.
        return page_limit + 1

    async def fake_generate_cv(**kwargs):  # type: ignore[no-untyped-def]
        base = kwargs.get("cv_data") or {}
        iteration = base.get("iteration", 0) + 1
        return {"iteration": iteration}

    monkeypatch.setattr("app.routers.cv.get_cv_layout_feedback", fake_get_cv_layout_feedback)
    monkeypatch.setattr("app.routers.cv.count_cv_pdf_pages", fake_count_cv_pdf_pages)
    monkeypatch.setattr("app.routers.cv.generate_cv", fake_generate_cv)

    emitter = DummyEmit()

    max_iters = 3
    result = await _apply_layout_feedback_and_regenerate(
        cv_data=cv_data_first,
        original_content="orig",
        job_description="desc",
        additional_info=None,
        page_limit=1,
        user=user,
        cv=cv,
        emit=emitter,
        job=job,
        progress=70,
        max_layout_iterations=max_iters,
    )

    # We expect to stop after max_iters iterations.
    assert result["iteration"] == max_iters

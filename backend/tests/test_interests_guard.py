from typing import Any, Dict

import pytest

from app.services.cv_generator import generate_cv


@pytest.mark.asyncio
async def test_generate_cv_clears_single_interest(monkeypatch: Any) -> None:
  """
  If the underlying AI model returns a single-item interests list, our
  post-processing should clear it so downstream renderers never show a
  one-word Interests section.
  """

  async def fake_generate_completion(*args: Any, **kwargs: Dict[str, Any]) -> str:  # type: ignore[override]
    return """
    {
      "personal_info": {
        "full_name": "Test User",
        "email": "test@example.com",
        "phone": "",
        "location": "",
        "linkedin": "",
        "website": ""
      },
      "professional_summary": "Summary",
      "experience": [],
      "education": [],
      "skills": {
        "technical": [],
        "soft": [],
        "languages": [],
        "certifications": []
      },
      "interests": ["Motorsports"]
    }
    """

  from app import services as services_pkg
  from app.services import cv_generator as cv_generator_mod

  # Patch the generate_completion function used by cv_generator.
  monkeypatch.setattr(services_pkg.ai, "generate_completion", fake_generate_completion)  # type: ignore[attr-defined]
  monkeypatch.setattr(cv_generator_mod, "generate_completion", fake_generate_completion)

  result = await generate_cv(
    original_content="Original CV",
    job_description="Job description",
    additional_info=None,
    user_id="test-user",
    cv_id="test-cv",
    page_limit=1,
  )

  interests = result.get("interests")
  assert isinstance(interests, list)
  assert interests == []


from enum import StrEnum
from typing import Literal

from pydantic import BaseModel


class CVUploadResponse(BaseModel):
    id: str
    original_filename: str
    original_content: str
    status: str
    created_at: str

    model_config = {"from_attributes": True}


class CVGenerateRequest(BaseModel):
    cv_id: str | None = None
    job_id: str | None = None
    job_url: str | None = None
    job_description: str | None = None
    additional_info: str | None = None
    page_limit: Literal[1, 2] = 1


class CVFitRequest(BaseModel):
    """
    Request body for running a paid fit analysis without generating a CV yet.
    Mirrors CVGenerateRequest but is used only to create/associate a CV+Job
    and compute fit_analysis.
    """

    cv_id: str | None = None
    job_id: str | None = None
    job_url: str | None = None
    job_description: str | None = None
    additional_info: str | None = None
    page_limit: Literal[1, 2] = 1


class CVUpdateRequest(BaseModel):
    """
    Full replacement of the generated CV JSON structure.

    The frontend is expected to send the candidate's complete, dated work
    history in `generated_cv_data["experience"]`. Server-side code will not
    auto-prune or synthesize roles; any removal of roles must be an explicit
    choice in the client.
    """

    generated_cv_data: dict


class CVRefineRequest(BaseModel):
    gap_feedback: dict[str, str]


class CVResponse(BaseModel):
    id: str
    original_filename: str
    original_content: str
    additional_info: str | None
    generated_cv_data: dict | None
    fit_analysis: dict | None = None
    page_limit: int | None = None
    job_id: str | None = None
    status: str
    created_at: str

    model_config = {"from_attributes": True}


class CVGenerationStage(StrEnum):
    START = "start"
    SETUP = "setup"
    SCRAPING_JOB = "scraping_job"
    JOB_METADATA = "job_metadata"
    DEDUCT_CREDIT = "deduct_credit"
    FIRST_PASS_GENERATION = "first_pass_generation"
    LAYOUT_FEEDBACK = "layout_feedback"
    SECOND_PASS_GENERATION = "second_pass_generation"
    SAVING = "saving"
    DONE = "done"
    ERROR = "error"


class CVGenerationProgressEvent(BaseModel):
    type: Literal["progress", "done", "error"]
    stage: CVGenerationStage
    message: str
    progress: int | None = None
    cv_id: str | None = None
    job_id: str | None = None
    result: "CVResponse | None" = None

    model_config = {"from_attributes": True}


class CVListItem(BaseModel):
    id: str
    original_filename: str
    status: str
    created_at: str
    job_title: str | None = None
    company_name: str | None = None

    model_config = {"from_attributes": True}

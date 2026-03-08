from pydantic import BaseModel
from typing import Literal


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


class CVUpdateRequest(BaseModel):
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


class CVListItem(BaseModel):
    id: str
    original_filename: str
    status: str
    created_at: str
    job_title: str | None = None
    company_name: str | None = None

    model_config = {"from_attributes": True}

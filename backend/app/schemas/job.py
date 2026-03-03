from pydantic import BaseModel


class JobResponse(BaseModel):
    id: str
    cv_id: str
    job_url: str | None
    job_description: str
    company_name: str | None
    job_title: str | None
    application_status: str
    applied_at: str | None
    created_at: str
    fit_score: int | None = None

    model_config = {"from_attributes": True}


class JobUpdateRequest(BaseModel):
    application_status: str | None = None
    company_name: str | None = None
    job_title: str | None = None
    applied_at: str | None = None


class ScrapeRequest(BaseModel):
    url: str


class ScrapeResponse(BaseModel):
    job_description: str
    job_title: str | None = None
    company_name: str | None = None
    success: bool = True
    reason: str | None = None

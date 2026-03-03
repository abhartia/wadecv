from pydantic import BaseModel


class CoverLetterGenerateRequest(BaseModel):
    job_id: str


class CoverLetterUpdateRequest(BaseModel):
    content: str


class CoverLetterResponse(BaseModel):
    id: str
    job_id: str
    cv_id: str
    content: str
    created_at: str

    model_config = {"from_attributes": True}

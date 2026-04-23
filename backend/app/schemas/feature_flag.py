from pydantic import BaseModel


class FeatureFlagResponse(BaseModel):
    name: str
    enabled: bool

    model_config = {"from_attributes": True}

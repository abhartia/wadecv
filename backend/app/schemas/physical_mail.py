from typing import Literal

from pydantic import BaseModel


class AddressSchema(BaseModel):
    name: str
    address_line1: str
    address_line2: str = ""
    city: str
    state: str
    zip: str
    country: str = "US"


class ExtractAddressRequest(BaseModel):
    job_id: str


class ExtractAddressResponse(BaseModel):
    found: bool
    name: str = ""
    address_line1: str = ""
    address_line2: str = ""
    city: str = ""
    state: str = ""
    zip: str = ""
    country: str = "US"


class SendMailRequest(BaseModel):
    job_id: str
    content_type: Literal["cv_only", "cover_letter_only", "both"]
    to_address: AddressSchema
    from_address: AddressSchema
    save_return_address: bool = True


class PhysicalMailResponse(BaseModel):
    id: str
    job_id: str
    lob_letter_id: str | None
    content_type: str
    status: str
    credits_charged: int
    created_at: str

    model_config = {"from_attributes": True}

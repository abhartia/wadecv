from pydantic import BaseModel, EmailStr
from typing import Literal


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class MagicLinkRequest(BaseModel):
    email: EmailStr


class MagicLinkVerify(BaseModel):
    token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class ProfileUpdateRequest(BaseModel):
    base_cv_content: str | None = None
    additional_info: str | None = None
    cv_page_limit: Literal[1, 2] | None = None


class UserResponse(BaseModel):
    id: str
    email: str
    email_verified: bool
    credits: int
    has_profile: bool = False
    has_password: bool = False
    base_cv_content: str | None = None
    additional_info: str | None = None
    cv_page_limit: int = 1
    created_at: str

    model_config = {"from_attributes": True}

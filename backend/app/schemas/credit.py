from pydantic import BaseModel


class CreditPack(BaseModel):
    id: str
    name: str
    credits: int
    price_cents: int
    price_display: str


class CheckoutRequest(BaseModel):
    pack_id: str


class CheckoutResponse(BaseModel):
    checkout_url: str


class CreditTransactionResponse(BaseModel):
    id: str
    amount: int
    type: str
    description: str
    created_at: str

    model_config = {"from_attributes": True}


class CreditBalanceResponse(BaseModel):
    credits: int
    transactions: list[CreditTransactionResponse]

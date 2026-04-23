from pydantic import BaseModel


class GapInsightTheme(BaseModel):
    label: str
    description: str
    count: int


class GapInsights(BaseModel):
    summary_text: str
    themes: list[GapInsightTheme] = []
    updated_at: str | None = None


class GapInsightsResponse(BaseModel):
    available: bool
    total_applications: int
    next_refresh_at: int | None = None
    gap_insights: GapInsights | None = None

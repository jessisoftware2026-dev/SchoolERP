from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., examples=["How many students are in Grade 9?"])
    session_id: str | None = None


class ChatResponse(BaseModel):
    reply: str
    model: str


class RiskRequest(BaseModel):
    student_id: str
    attendance_rate: float = Field(..., ge=0, le=1, examples=[0.72])
    avg_score: float = Field(..., ge=0, le=100, examples=[58])
    fee_overdue: bool = False


class RiskResponse(BaseModel):
    student_id: str
    risk_score: float
    risk_level: str
    factors: list[str]


class EmbedRequest(BaseModel):
    text: str


class EmbedResponse(BaseModel):
    dimensions: int
    vector: list[float]

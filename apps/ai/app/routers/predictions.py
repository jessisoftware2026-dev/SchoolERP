import hashlib

from fastapi import APIRouter

from app.schemas import (
    EmbedRequest,
    EmbedResponse,
    RiskRequest,
    RiskResponse,
)

router = APIRouter(prefix="/ai", tags=["predictions"])


@router.post("/predict/risk", response_model=RiskResponse)
def predict_risk(req: RiskRequest) -> RiskResponse:
    """Heuristic at-risk score (stub).

    Demonstrates the contract; swap the heuristic for a trained model
    (scikit-learn / gradient boosting) when data is available.
    """
    score = 0.0
    factors: list[str] = []

    if req.attendance_rate < 0.75:
        score += 0.4
        factors.append("low attendance")
    if req.avg_score < 60:
        score += 0.4
        factors.append("low average score")
    if req.fee_overdue:
        score += 0.2
        factors.append("fees overdue")

    score = round(min(score, 1.0), 2)
    level = "high" if score >= 0.6 else "medium" if score >= 0.3 else "low"

    return RiskResponse(
        student_id=req.student_id,
        risk_score=score,
        risk_level=level,
        factors=factors or ["no significant risk factors"],
    )


@router.post("/embed", response_model=EmbedResponse)
def embed(req: EmbedRequest) -> EmbedResponse:
    """Deterministic pseudo-embedding (stub).

    Replace with a real embedding model; store vectors in PostgreSQL via
    pgvector for semantic search across ERP documents.
    """
    dims = 16
    digest = hashlib.sha256(req.text.encode()).digest()
    vector = [b / 255.0 for b in digest[:dims]]
    return EmbedResponse(dimensions=dims, vector=vector)

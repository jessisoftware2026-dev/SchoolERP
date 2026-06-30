from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import chat, predictions

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="Isolated Python AI microservice for the Jessi ERP platform.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(predictions.router)


@app.get("/health", tags=["health"])
def health() -> dict:
    return {"status": "ok", "service": "jessi-ai", "version": settings.version}

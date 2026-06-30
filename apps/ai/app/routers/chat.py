from fastapi import APIRouter

from app.schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/ai", tags=["assistant"])


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    """Assistant chatbot endpoint (stub).

    Replace this with an LLM call (OpenAI / local model) and ground it on ERP
    data retrieved via pgvector semantic search.
    """
    reply = (
        f"(stub) You said: '{req.message}'. "
        "Wire an LLM provider in app/routers/chat.py to enable real answers."
    )
    return ChatResponse(reply=reply, model="stub-0")

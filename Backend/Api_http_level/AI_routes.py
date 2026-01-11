

import uuid
from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# Import your AI service layer (to be implemented separately)
from Backend.Services.ai_service import AIService

router = APIRouter()


class AIQueryRequest(BaseModel):
    question: str
    context_ids: List[uuid.UUID]


@router.post("/ai/query")
def ask_ai(request: AIQueryRequest):
    """
    Accept a user question and optional context IDs.
    Delegates to AIService for explanation generation.
    """
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    service = AIService()
    response = service.answer_question(
        question=request.question,
        context_ids=request.context_ids,
    )

    return {"status": "success", "answer": response}

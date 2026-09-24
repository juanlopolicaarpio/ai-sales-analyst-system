from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.demo.analyst import answer_demo_question
from app.demo.data import DEMO_OVERVIEW


router = APIRouter()


class AnalystQuestion(BaseModel):
    question: str = Field(min_length=3, max_length=500)


@router.get("/overview")
async def overview():
    return DEMO_OVERVIEW


@router.post("/ask")
async def ask(payload: AnalystQuestion):
    return answer_demo_question(payload.question)

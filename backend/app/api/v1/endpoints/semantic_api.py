from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Dict, Any, List

from app.core.semantic_rag import semantic_engine

router = APIRouter(tags=["Semantic Search & RAGAS Benchmark"])

class SemanticSearchRequest(BaseModel):
    query: str = Field(..., example="What are the winter kerosene fuel additive guidelines?")
    top_k: int = Field(default=2, ge=1, le=5, example=2)

class RagasEvalRequest(BaseModel):
    query: str = Field(..., example="What is the winter buffer for Siachen Kumar?")
    retrieved_context: str = Field(..., example="Forward glacial outposts above 15,000 ft must maintain a minimum 14-day safety buffer of Arctic Grade Kerosene (Class III) and 21 days of Class I High-Calorie Rations.")
    generated_answer: str = Field(..., example="According to SOP Para 18.2, maintain a minimum 14 days of Arctic Kerosene and 21 days of Class I High-Calorie Rations.")

@router.post(
    "/copilot/semantic_search",
    summary="Dense Vector Semantic Search over Military Doctrines",
    description="Calculates normalized dense cosine similarity over Army Logistics doctrines."
)
def semantic_search(req: SemanticSearchRequest):
    results = semantic_engine.semantic_search(req.query, top_k=req.top_k)
    return {
        "query": req.query,
        "total_results": len(results),
        "results": results
    }

@router.post(
    "/copilot/ragas_eval",
    summary="Compute Automated RAGAS Quality Metrics",
    description="Evaluates Context Relevance, Faithfulness, and Answer Semantic Match for the RAG Copilot."
)
def evaluate_ragas(req: RagasEvalRequest):
    return semantic_engine.compute_ragas_evaluation(
        query=req.query,
        retrieved_context=req.retrieved_context,
        generated_answer=req.generated_answer
    )

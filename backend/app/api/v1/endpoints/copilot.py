from fastapi import APIRouter
from app.schemas.copilot import CopilotQueryRequest, CopilotResponse
from app.core.rag_engine import sop_copilot

router = APIRouter(tags=["Military SOP & Doctrine RAG Copilot"])

@router.post(
    "/copilot/query",
    response_model=CopilotResponse,
    summary="Query Indian Army Doctrine & SOP Manuals",
    description="Performs semantic & keyword retrieval over Northern Command high-altitude warfare manuals, Siachen logistics winter reserves, Murgo choke point protocols, and medical emergency guidelines."
)
def query_sop_doctrine(req: CopilotQueryRequest):
    return sop_copilot.query(req.query)

@router.get(
    "/copilot/manuals",
    summary="List Indexed Doctrine Documents",
    description="Lists high-altitude logistics SOP manuals currently ingested into the RAG vector index."
)
def list_doctrine_manuals():
    docs = []
    for doc in sop_copilot.DOCTRINE_KB:
        docs.append({
            "doc_id": doc["id"],
            "title": doc.get("topic", doc.get("id")),
            "section": doc.get("citation", "Standard SOP"),
            "classification": "RESTRICTED",
            "char_count": len(doc.get("response", ""))
        })
    return {
        "indexed_chunks": len(docs),
        "documents": docs
    }

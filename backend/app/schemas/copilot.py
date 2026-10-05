from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class CopilotQueryRequest(BaseModel):
    query: str = Field(
        ..., 
        description="Operational inquiry regarding Indian Army High Altitude SOP, doctrine, or equipment limits",
        example="What is the winter SOP reserve requirement for Siachen Kumar Base?"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "query": "What is the winter SOP reserve requirement for Siachen Kumar Base?"
            }
        }

class CopilotResponse(BaseModel):
    query: str
    response: str = Field(..., description="Direct SOP protocol guidance for commanders")
    source_citation: str = Field(..., description="Official manual paragraph citation")
    doctrine_id: str = Field(..., description="Doctrine document identifier")
    relevance_confidence: str = Field(..., description="Semantic match percentage")
    confidence_score: Optional[float] = Field(None, description="Numerical confidence value between 0.0 and 1.0")
    citations: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="Structured citation metadata")

from pydantic import BaseModel, Field
from typing import TypeVar, Generic, Optional, Any, Dict, List

T = TypeVar("T")

class BaseResponse(BaseModel, Generic[T]):
    """Standardized API envelope for consistent debugging and frontend consumption."""
    success: bool = Field(True, description="Indicates whether the request completed successfully")
    message: str = Field("OK", description="Human-readable status summary")
    data: Optional[T] = Field(None, description="Payload data")
    timestamp: str = Field(..., description="ISO 8601 UTC timestamp of execution")
    request_id: Optional[str] = Field(None, description="Unique correlation ID for tracing")

class ErrorDetail(BaseModel):
    """Detailed error schema for debugging failed validations or exceptions."""
    error_code: str = Field(..., description="Machine-readable error constant (e.g., ROUTE_BLOCKED)")
    detail: str = Field(..., description="In-depth explanation of the error")
    suggestion: Optional[str] = Field(None, description="Actionable operational recommendation")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Diagnostic parameters")

class ErrorResponse(BaseModel):
    success: bool = Field(False, description="Always false for error responses")
    error: ErrorDetail
    timestamp: str
    request_id: Optional[str] = None

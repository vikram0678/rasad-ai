from typing import Any, Dict, Optional

class MilitaryLogisticsException(Exception):
    """Base class for all RASAD-AI domain exceptions."""
    def __init__(
        self,
        message: str,
        error_code: str = "SYSTEM_ERROR",
        status_code: int = 400,
        suggestion: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.suggestion = suggestion
        self.context = context or {}

class NodeNotFoundException(MilitaryLogisticsException):
    def __init__(self, node_id: str):
        super().__init__(
            message=f"Military node or outpost identifier '{node_id}' does not exist in Ladakh theater topology.",
            error_code="NODE_NOT_FOUND",
            status_code=404,
            suggestion="Verify node ID against /api/posts or /api/depots, or check tactical map spelling.",
            context={"requested_node": node_id}
        )

class CorridorBlockedException(MilitaryLogisticsException):
    def __init__(self, origin: str, destination: str, details: str):
        super().__init__(
            message=f"No viable traversable corridor found between '{origin}' and '{destination}'. Path obstructed.",
            error_code="CORRIDOR_BLOCKED",
            status_code=409,
            suggestion="Consider air-bridge resupply via Siachen Battle School ALH Dhruv or clear avalanche choke points.",
            context={"origin": origin, "destination": destination, "reason": details}
        )

class GuardrailSafetyViolationException(MilitaryLogisticsException):
    def __init__(self, reason: str, failed_stage: int):
        super().__init__(
            message=f"Dispatch clearance refused by automated safety guardrail (Stage {failed_stage}): {reason}",
            error_code="GUARDRAIL_VIOLATION",
            status_code=422,
            suggestion="Review vehicle payload limits, route avalanche hazard status, or depot reserve levels.",
            context={"failed_stage": failed_stage, "reason": reason}
        )

class InvalidTelemetryException(MilitaryLogisticsException):
    def __init__(self, field_name: str, message: str):
        super().__init__(
            message=f"Invalid sensor telemetry or weather input for field '{field_name}': {message}",
            error_code="INVALID_TELEMETRY",
            status_code=422,
            suggestion="Ensure temperatures are between -60°C and +45°C, altitude between 1000m and 7500m.",
            context={"field": field_name}
        )

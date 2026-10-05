from fastapi import APIRouter
from app.schemas.guardrail import DispatchOrderRequest, GuardrailValidationResult
from app.core.guardrail_engine import guardrail_system
from app.core.database import tactical_db

router = APIRouter(tags=["Multi-Stage Dispatch Safety Guardrails"])

@router.post(
    "/dispatch/guardrails",
    response_model=GuardrailValidationResult,
    summary="Validate Convoy Dispatch Order (4-Stage Safety Guardrail)",
    description="Enforces strict verification across 4 stages: (1) Depot Reserve Buffer Integrity, (2) Route Avalanche Hazard Clearance, (3) Vehicle Fleet Payload & Weight Capacity, and (4) Cryptographic HMAC-SHA256 clearance token. Automatically logs approved convoys."
)
def validate_dispatch_order(order: DispatchOrderRequest):
    result = guardrail_system.validate_dispatch(order)
    if result.is_approved:
        tactical_db.log_dispatch(
            order_id=order.order_id,
            target=order.target_outpost,
            payload_info=f"{order.cargo_weight_kg} kg ({order.vehicle_count}x {order.vehicle_type}) via {order.assigned_route}",
            token=result.authorization_token
        )
    return result

@router.get(
    "/dispatch/history",
    summary="List Cleared Convoy Dispatches",
    description="Returns immutable log of all verified, crypto-signed convoy movements."
)
def get_dispatch_history():
    return {
        "count": len(tactical_db.dispatches),
        "dispatches": tactical_db.dispatches
    }

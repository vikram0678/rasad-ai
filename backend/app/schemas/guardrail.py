from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class DispatchOrderRequest(BaseModel):
    order_id: str = Field(..., description="Unique alphanumeric military dispatch order code", example="DSP-LADAKH-8842")
    origin_depot: str = Field(..., description="Issuing depot facility", example="DEPOT-KHALSAR")
    target_outpost: str = Field(..., description="Designated destination outpost", example="OP-DBO-01")
    vehicle_type: str = Field(default="Tatra 8x8 Heavy Utility Truck", description="Transport vehicle platform", example="Tatra 8x8 Heavy Utility Truck")
    vehicle_count: int = Field(default=4, ge=1, le=50, description="Number of vehicles in convoy", example=4)
    cargo_weight_kg: float = Field(..., ge=0, description="Gross cargo mass in kg", example=18500.0)
    payload_fuel_liters: float = Field(default=0.0, ge=0, description="Class III POL volume in liters", example=4500.0)
    payload_ammo_rounds: int = Field(default=0, ge=0, description="Class V munitions count in rounds", example=12000)
    assigned_route: str = Field(..., description="Designated march corridor", example="Western Shyok Ridge Bypass")
    route_is_blocked: bool = Field(default=False, description="Flag indicating route sector is snow/avalanche closed", example=False)

    class Config:
        json_schema_extra = {
            "example": {
                "order_id": "DSP-LADAKH-8842",
                "origin_depot": "DEPOT-KHALSAR",
                "target_outpost": "OP-DBO-01",
                "vehicle_type": "Tatra 8x8 Heavy Utility Truck",
                "vehicle_count": 4,
                "cargo_weight_kg": 18500.0,
                "payload_fuel_liters": 4500.0,
                "payload_ammo_rounds": 12000,
                "assigned_route": "Western Shyok Ridge Bypass",
                "route_is_blocked": False
            }
        }

class GuardrailStageResult(BaseModel):
    stage_id: int
    name: str
    rule: str
    status: str = Field(..., description="PASSED or FAILED")
    detail: str

class GuardrailValidationResult(BaseModel):
    is_approved: bool = Field(..., description="True if all 4 stages pass successfully")
    stages: List[GuardrailStageResult]
    authorization_token: Optional[str] = Field("", description="HMAC-SHA256 signature when cleared")
    rejection_reason: Optional[str] = Field("", description="Primary safety failure reason if refused")

from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

from app.core.ew_resilience import ew_engine

router = APIRouter(tags=["Adversarial Electronic Warfare (EW) Resilience"])

class GPSValidationRequest(BaseModel):
    asset_id: str = Field(default="CONVOY_ALPHA_01", example="CONVOY_ALPHA_01")
    reported_lat: float = Field(..., example=34.5020)
    reported_lng: float = Field(..., example=77.6820)
    reported_timestamp: Optional[float] = None

class InventoryValidationRequest(BaseModel):
    post_id: str = Field(default="OP_DBO", example="OP_DBO")
    reported_ammo_rds: float = Field(..., example=47800.0)
    reported_temp_c: float = Field(..., example=-24.5)
    active_combat_declared: bool = Field(default=False, example=False)

@router.post(
    "/ew/validate_gps",
    summary="Validate GPS Telemetry Against EW Spoofing & Meaconing",
    description="Validates physical velocity limits to detect adversary GPS coordinate jumps, reverting to dead-reckoning Kalman filter coordinates."
)
def validate_gps_telemetry(req: GPSValidationRequest):
    return ew_engine.validate_gps_telemetry(
        asset_id=req.asset_id,
        reported_lat=req.reported_lat,
        reported_lng=req.reported_lng,
        reported_timestamp=req.reported_timestamp
    )

@router.post(
    "/ew/validate_inventory",
    summary="Filter Cyber-Physical Warehouse Telemetry via Kalman State Estimator",
    description="Detects sudden impossible inventory dumps injected by cyber adversaries, applying Kalman smoothing."
)
def validate_inventory_telemetry(req: InventoryValidationRequest):
    return ew_engine.validate_inventory_telemetry(
        post_id=req.post_id,
        reported_ammo_rds=req.reported_ammo_rds,
        reported_temp_c=req.reported_temp_c,
        active_combat_declared=req.active_combat_declared
    )

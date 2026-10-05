from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Dict, Any

from app.core.multimodal_engine import multimodal_engine

router = APIRouter(tags=["Tri-Modal Logistics Fusion (Ground + Air Drop + Drone)"])

class MultiModalRequest(BaseModel):
    target_outpost: str = Field(default="OP_DBO", example="OP_DBO")
    class1_rations_kg: float = Field(default=2400.0, example=2400.0)
    class3_fuel_liters: float = Field(default=4800.0, example=4800.0)
    class8_medical_kits: float = Field(default=15.0, example=15.0)
    road_corridor_is_blocked: bool = Field(default=True, example=True)
    airspace_wind_speed_kmh: float = Field(default=35.0, example=35.0)

@router.post(
    "/logistics/multimodal",
    summary="Allocate Mission Across Ground, IAF C-130J, and Autonomous UAV",
    description="Automatically triggers aerial parachute drop and tactical logistics drone corridors when mountain roads are severed by avalanches."
)
def allocate_multimodal_mission(req: MultiModalRequest):
    return multimodal_engine.allocate_multimodal_mission(
        target_outpost=req.target_outpost,
        class1_rations_kg=req.class1_rations_kg,
        class3_fuel_liters=req.class3_fuel_liters,
        class8_medical_kits=req.class8_medical_kits,
        road_corridor_is_blocked=req.road_corridor_is_blocked,
        airspace_wind_speed_kmh=req.airspace_wind_speed_kmh
    )

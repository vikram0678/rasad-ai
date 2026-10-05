from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

from app.core.xai_engine import xai_engine

router = APIRouter(tags=["Explainable AI (XAI) & SHAP Attribution"])

class XAIRequest(BaseModel):
    troops: int = Field(default=340, example=340)
    altitude_m: float = Field(default=5065.0, example=5065.0)
    ambient_temp_c: float = Field(default=-24.0, example=-24.0)
    defcon_level: int = Field(default=2, example=2)
    snow_depth_cm: float = Field(default=35.0, example=35.0)
    wind_speed_kmh: float = Field(default=45.0, example=45.0)
    total_predicted_rations_kg: Optional[float] = Field(default=856.0, example=856.0)
    total_predicted_fuel_liters: Optional[float] = Field(default=1768.0, example=1768.0)

@router.post(
    "/forecast/xai",
    summary="Compute SHAP Feature Attribution & Commander's Rationale",
    description="Decomposes predicted supply numbers into exact percentage contributions (sub-zero thermal cold, hypoxia generator de-rating, DEFCON posture, terrain friction)."
)
def get_xai_attribution(req: XAIRequest):
    return xai_engine.compute_feature_attribution(
        troops=req.troops,
        altitude_m=req.altitude_m,
        ambient_temp_c=req.ambient_temp_c,
        defcon_level=req.defcon_level,
        snow_depth_cm=req.snow_depth_cm,
        wind_speed_kmh=req.wind_speed_kmh,
        total_predicted_rations_kg=req.total_predicted_rations_kg or 856.0,
        total_predicted_fuel_liters=req.total_predicted_fuel_liters or 1768.0
    )

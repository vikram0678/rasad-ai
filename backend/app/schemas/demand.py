from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

class StockLevels(BaseModel):
    class1_rations_kg: float = Field(..., description="Rations in Kilograms", example=1850.0)
    class3_pol_liters: float = Field(..., description="Petroleum, Oil, Lubricants in Liters", example=3200.0)
    class5_ammo_rounds: float = Field(..., description="Ammunition in Rounds", example=48000.0)
    class8_medical_kits: float = Field(..., description="Medical Trauma / HAPE Kits", example=42.0)

class ForecastRequest(BaseModel):
    troops: int = Field(..., ge=1, le=5000, description="Effective troop strength stationed at post", example=340)
    altitude_m: float = Field(..., ge=1000, le=7500, description="Terrain elevation above sea level in meters", example=5065.0)
    ambient_temp_c: float = Field(..., ge=-60.0, le=45.0, description="Ambient temperature in degrees Celsius", example=-24.0)
    defcon_level: int = Field(2, ge=1, le=5, description="Defense Readiness Condition (1=Active Combat, 5=Peace)", example=2)
    snow_depth_cm: Optional[float] = Field(35.0, ge=0, description="Snowpack accumulation on ground in cm", example=35.0)
    wind_speed_kmh: Optional[float] = Field(45.0, ge=0, description="Wind speed in km/h", example=45.0)
    current_stock: Optional[StockLevels] = Field(
        default=None, 
        description="Optional current on-hand warehouse inventory to compute Days of Supply (DOS)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "troops": 340,
                "altitude_m": 5065.0,
                "ambient_temp_c": -24.0,
                "defcon_level": 2,
                "snow_depth_cm": 35.0,
                "wind_speed_kmh": 45.0,
                "current_stock": {
                    "class1_rations_kg": 1850.0,
                    "class3_pol_liters": 3200.0,
                    "class5_ammo_rounds": 48000.0,
                    "class8_medical_kits": 42.0
                }
            }
        }

class ClassStockHealth(BaseModel):
    current_stock: float
    daily_burn: float
    days_remaining: float
    is_critical: bool

class InventoryHealth(BaseModel):
    overall_days_of_supply: float = Field(..., description="Minimum DOS across all classes (bottleneck)")
    health_status: str = Field(..., description="OPTIMAL, WARNING, or CRITICAL")
    classes: Dict[str, ClassStockHealth] = Field(..., description="Supply class breakdown")

class ForecastResponse(BaseModel):
    forecast_result: Dict[str, Any] = Field(..., description="Physiological demand model predictions and stress metrics")
    ml_tabular_inference: Dict[str, Any] = Field(..., description="Random Forest regressor predictions, metrics, and feature importances")
    inventory_health: InventoryHealth = Field(..., description="Computed Days of Supply across classes")

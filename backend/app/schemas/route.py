from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class RouteRequest(BaseModel):
    origin: str = Field(..., description="Origin node identifier (e.g., FSB_KHALSAR, HQ_LEH)", example="FSB_KHALSAR")
    destination: str = Field(..., description="Destination node identifier (e.g., OP_DBO, SIACHEN_KUMAR)", example="OP_DBO")
    blocked_nodes: List[str] = Field(
        default=["MURGO_CHOKE"], 
        description="List of nodes blocked by snowdrifts, blizzards, or enemy fire",
        example=["MURGO_CHOKE"]
    )
    weather_hazard_level: str = Field(
        default="NORMAL", 
        description="Hazard level: NORMAL, HIGH, or SEVERE (applies travel penalty)",
        example="NORMAL"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "origin": "FSB_KHALSAR",
                "destination": "OP_DBO",
                "blocked_nodes": ["MURGO_CHOKE"],
                "weather_hazard_level": "NORMAL"
            }
        }

class WaypointInfo(BaseModel):
    node_id: str
    name: str
    lat: float
    lng: float
    elevation_m: int

class ElevationProfile(BaseModel):
    max_altitude_m: int
    min_altitude_m: int
    total_climb_m: int
    pass_crossings: List[str]

class RouteResponse(BaseModel):
    status: str = Field(..., example="OPTIMAL_PATH_FOUND")
    origin: str
    destination: str
    distance_km: float
    estimated_transit_hours: float
    path_nodes: List[str]
    waypoints: List[WaypointInfo]
    elevation_profile: ElevationProfile
    hazard_rerouted: bool
    corridor_type: str

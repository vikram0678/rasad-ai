from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

from app.core.cvrptw_engine import cvrptw_solver

router = APIRouter(tags=["Operations Research (CVRPTW) Engine"])

class CVRPTWRequest(BaseModel):
    origin_depot: str = Field(..., example="DEPOT-KHALSAR")
    target_outpost: str = Field(..., example="OP-DBO-01")
    total_cargo_kg: float = Field(..., ge=100.0, example=28000.0)
    preferred_vehicle: str = Field(default="TATRA_8X8", example="TATRA_8X8")
    departure_time: str = Field(default="07:00", example="07:00")
    crosses_bailey_bridge: bool = Field(default=True, example=True)

@router.post(
    "/route/cvrptw",
    summary="Solve Capacitated Vehicle Routing with Bridge MLC & Time Windows",
    description="Applies Operations Research to allocate heterogeneous military fleets, enforces MLC-24 Bailey bridge load limits, and validates diurnal mountain pass blizzard time windows."
)
def solve_cvrptw_route(req: CVRPTWRequest):
    return cvrptw_solver.solve_cvrptw(
        origin_depot=req.origin_depot,
        target_outpost=req.target_outpost,
        total_cargo_kg=req.total_cargo_kg,
        preferred_vehicle=req.preferred_vehicle,
        departure_time_str=req.departure_time,
        crosses_bailey_bridge=req.crosses_bailey_bridge
    )

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

router = APIRouter(tags=["C4ISR Resilience & What-If Simulator"])

class ResilienceMetrics(BaseModel):
    inventory: int
    routes: int
    fleet: int
    forecast: int
    connectivity: int

class ResilienceResponse(BaseModel):
    score: int
    status: str
    max_score: int
    sector: str
    metrics: ResilienceMetrics
    assessment: str
    choke_points: List[str]
    mesh_redundancy_percent: float

class WargameRequest(BaseModel):
    scenario: str = "Route A becomes unavailable"
    weather_hazard: Optional[str] = "Heavy Snow"
    surge_percent: Optional[int] = 25

class WargameResponse(BaseModel):
    scenario: str
    locations_affected: int
    affected_nodes: List[str]
    eta_increase: str
    alternative_routes_available: bool
    additional_vehicles_required: int
    impact_summary: List[str]
    recommended_remedy: str
    criticality_level: str

# 1. Resilience Endpoint
@router.get(
    "/resilience",
    response_model=ResilienceResponse,
    summary="Get Operational Network Resilience & Risk Metrics",
    description="Evaluates theater supply network health across inventory, routing paths, fleet readiness, ML forecasts, and mesh connectivity."
)
def get_network_resilience():
    return ResilienceResponse(
        score=82,
        status="Healthy",
        max_score=100,
        sector="Northern Command - Ladakh 14 Corps",
        metrics=ResilienceMetrics(
            inventory=87,
            routes=79,
            fleet=72,
            forecast=91,
            connectivity=84
        ),
        assessment="Network resilient against single-corridor severance. Alternative Zoji La bypass active.",
        choke_points=[
            "Zoji La Pass (Elevation 3,528m)",
            "Khardung La (Elevation 5,359m)",
            "Fotu La (Elevation 4,108m)"
        ],
        mesh_redundancy_percent=94.2
    )

# 2. What-If Simulator Endpoint
@router.post(
    "/simulator/wargame",
    response_model=WargameResponse,
    summary="Simulate Tactical Choke Point Severance & Supply Surges",
    description="Computes dynamic impact on forward posts when primary corridors are blocked by avalanche, landslides, or kinetic threats."
)
def run_what_if_simulation(req: WargameRequest):
    scenario = req.scenario
    if "snowfall" in scenario.lower() or "zoji" in scenario.lower():
        return WargameResponse(
            scenario=scenario,
            locations_affected=4,
            affected_nodes=["Dras Depot", "Kargil Depot", "Post Delta", "Post Echo"],
            eta_increase="12-24 hours",
            alternative_routes_available=True,
            additional_vehicles_required=8,
            impact_summary=[
                "4 locations affected across Dras corridor",
                "ETA increase: 12-24 hours through bypass",
                "Alternative Manali-Sarchu corridor active",
                "Additional 8 heavy-lift ATV/UAV units deployed"
            ],
            recommended_remedy="Shift primary convoy route to Manali-Leh Highway. Deploy Mi-17V5 heavy airlifts.",
            criticality_level="HIGH"
        )
    elif "fuel" in scenario.lower() or "siachen" in scenario.lower():
        return WargameResponse(
            scenario=scenario,
            locations_affected=2,
            affected_nodes=["Base Leh", "Post Charlie"],
            eta_increase="2-6 hours",
            alternative_routes_available=True,
            additional_vehicles_required=4,
            impact_summary=[
                "2 locations affected by Siachen cold-start surge",
                "ETA increase: 2-6 hours due to priority convoys",
                "Alternative bulk POL bowsers operational",
                "Additional 4 ALS 6x6 fuel tankers mobilized"
            ],
            recommended_remedy="Release 40,000L Class II reserve from Leh Subterranean Depot.",
            criticality_level="WARNING"
        )
    else:
        # Default: Route A becomes unavailable
        return WargameResponse(
            scenario="Route A becomes unavailable",
            locations_affected=3,
            affected_nodes=["Post Charlie", "Post Delta", "Dras Depot"],
            eta_increase="4-12 hours",
            alternative_routes_available=True,
            additional_vehicles_required=6,
            impact_summary=[
                "3 locations affected",
                "ETA increase: 4-12 hours",
                "Alternative routes available",
                "Additional 6 vehicles required"
            ],
            recommended_remedy="Reroute via Southern Corridor B (Manali - Sarchu - Leh axis). Mobilize 6 tactical trucks.",
            criticality_level="CRITICAL"
        )

# 3. Fleet Allocation Endpoint
@router.get(
    "/fleet/allocation",
    summary="Get Tactical Fleet Allocation & Vehicle Readiness",
    description="Returns breakdown of 6x6 trucks, ATVs, logistics drones, and heavy helicopters."
)
def get_fleet_allocation():
    return {
        "total_assets": 130,
        "available_assets": 94,
        "readiness_percent": 72.3,
        "fleet": [
            {
                "id": "f-1",
                "name": "6x6 Tactical Trucks",
                "icon": "truck",
                "available": 45,
                "total": 60,
                "percent": 75,
                "status": "Available"
            },
            {
                "id": "f-2",
                "name": "All Terrain Vehicles (ATV)",
                "icon": "atv",
                "available": 28,
                "total": 40,
                "percent": 70,
                "status": "Available"
            },
            {
                "id": "f-3",
                "name": "Logistics Drones (UAV)",
                "icon": "drone",
                "available": 15,
                "total": 20,
                "percent": 75,
                "status": "Available"
            },
            {
                "id": "f-4",
                "name": "Helicopter (Heavy Lift)",
                "icon": "helicopter",
                "available": 6,
                "total": 10,
                "percent": 60,
                "status": "Limited"
            }
        ]
    }

# 4. Live Dispatches Endpoint
@router.get(
    "/dispatches/live",
    summary="Get Active Live Dispatches Across Corridors",
    description="Returns list of in-transit resupply missions, status badges, and ETAs."
)
def get_live_dispatches():
    return {
        "total_dispatches": 4,
        "dispatches": [
            {
                "id": "DP-101",
                "from": "Base Manali",
                "to": "Post Echo",
                "status": "En Route",
                "eta": "ETA 6h",
                "badge_type": "en-route",
                "cargo": "Class I - Rations (150 crates)"
            },
            {
                "id": "DP-102",
                "from": "Base Jammu",
                "to": "Dras Depot",
                "status": "En Route",
                "eta": "ETA 8h",
                "badge_type": "en-route",
                "cargo": "Class II - POL (12,000L Fuel)"
            },
            {
                "id": "DP-103",
                "from": "Base Leh",
                "to": "Post Bravo",
                "status": "Preparing",
                "eta": "ETA 12h",
                "badge_type": "preparing",
                "cargo": "Class V - 155mm Artillery Shells"
            },
            {
                "id": "DP-104",
                "from": "Base Srinagar",
                "to": "Kargil",
                "status": "On Hold",
                "eta": "-",
                "badge_type": "on-hold",
                "cargo": "Extreme Winter Protective Gear"
            }
        ]
    }

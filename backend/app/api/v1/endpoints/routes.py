from fastapi import APIRouter
from app.schemas.route import RouteRequest, RouteResponse
from app.core.route_engine import route_optimizer
from app.core.exceptions import CorridorBlockedException, NodeNotFoundException

router = APIRouter(tags=["GIS Dynamic Routing & Obstacle Avoidance"])

@router.post(
    "/route/optimize",
    response_model=RouteResponse,
    summary="Compute Optimal Mountain Supply Corridor",
    description="Uses NetworkX graph pathfinding across Ladakh corridors, evaluating snow accumulation, elevation climb, and dynamically routing around avalanche choke points (e.g. Murgo Choke Point KM 134 to Western Shyok Ridge Bypass)."
)
def optimize_route(req: RouteRequest):
    # Verify origin and destination exist
    if req.origin not in route_optimizer.graph.nodes:
        raise NodeNotFoundException(req.origin)
    if req.destination not in route_optimizer.graph.nodes:
        raise NodeNotFoundException(req.destination)

    result = route_optimizer.calculate_optimal_route(
        origin=req.origin,
        destination=req.destination,
        blocked_nodes=req.blocked_nodes,
        weather_hazard_level=req.weather_hazard_level
    )
    if "error" in result:
        raise CorridorBlockedException(
            origin=req.origin,
            destination=req.destination,
            details=result["error"]
        )
    return result

@router.get(
    "/route/network",
    summary="Retrieve Tactical Road Network Topology",
    description="Returns all graph nodes, mountain passes, elevations, and transit edges for map overlay rendering."
)
def get_road_network():
    nodes_data = []
    for node_id, data in route_optimizer.graph.nodes(data=True):
        nodes_data.append({
            "node_id": node_id,
            **data
        })
    
    edges_data = []
    for u, v, data in route_optimizer.graph.edges(data=True):
        edges_data.append({
            "from": u,
            "to": v,
            **data
        })

    return {
        "total_nodes": len(nodes_data),
        "total_edges": len(edges_data),
        "nodes": nodes_data,
        "edges": edges_data
    }

import networkx as nx
from typing import Dict, Any, List, Optional

class MilitaryRouteOptimizer:
    """
    Terrain and Weather-Aware GIS Route Planner using NetworkX.
    Models high-altitude mountain corridors with dynamic edge weights
    factoring in snow accumulation, slope gradients, and avalanche closures.
    """

    def __init__(self):
        self.graph = nx.Graph()
        self.build_ladakh_transport_graph()

    def build_ladakh_transport_graph(self):
        """
        Builds the Northern Command Ladakh tactical road network.
        Nodes represent strategic military hubs, mountain passes, and outposts.
        """
        self.graph.clear()

        # Nodes (coordinates, elevation, type)
        nodes = {
            "HQ_LEH": {"name": "14 Corps HQ Depot - Leh", "lat": 34.1526, "lng": 77.5771, "elev": 3524},
            "SOUTH_PULLU": {"name": "South Pullu Checkpoint", "lat": 34.2780, "lng": 77.6040, "elev": 4600},
            "KHARDUNG_LA": {"name": "Khardung La Pass", "lat": 34.3400, "lng": 77.6180, "elev": 5359},
            "NORTH_PULLU": {"name": "North Pullu Transit Post", "lat": 34.4200, "lng": 77.6500, "elev": 4700},
            "FSB_KHALSAR": {"name": "Forward Staging Base - Khalsar", "lat": 34.5020, "lng": 77.6820, "elev": 3100},
            "SASOMA": {"name": "Sasoma Glacial Staging Camp", "lat": 34.9500, "lng": 77.3500, "elev": 3800},
            "SIACHEN_KUMAR": {"name": "Siachen Glacial Base (Kumar)", "lat": 35.1500, "lng": 77.2100, "elev": 4880},
            "DARBUK": {"name": "Darbuk Military Node", "lat": 34.2500, "lng": 78.1000, "elev": 3850},
            "SHYOK_BEND": {"name": "Shyok River Junction", "lat": 34.5800, "lng": 77.8900, "elev": 3700},
            "MURGO_CHOKE": {"name": "Murgo Choke Point (DS-DBO Km 134)", "lat": 35.1000, "lng": 77.9800, "elev": 4450},
            "SHYOK_BYPASS": {"name": "Western Shyok Ridge Bypass", "lat": 34.9200, "lng": 77.8200, "elev": 4100},
            "OP_DBO": {"name": "OP Daulat Beg Oldi (DBO)", "lat": 35.4022, "lng": 77.9297, "elev": 5065},
            "CHANG_LA": {"name": "Chang La Strategic Pass", "lat": 34.0500, "lng": 78.1800, "elev": 5360},
            "PANGONG_F4": {"name": "Pangong Tso North Ridge (F4)", "lat": 33.7500, "lng": 78.4500, "elev": 4280},
            "DEPOT_UPSHI": {"name": "Eastern Sector Depot - Upshi", "lat": 33.8290, "lng": 77.8180, "elev": 3380}
        }

        for node_id, data in nodes.items():
            self.graph.add_node(node_id, **data)

        # Edges (distance_km, base_transit_hrs, road_class)
        edges = [
            ("HQ_LEH", "SOUTH_PULLU", 28, 1.2, "PAVED"),
            ("SOUTH_PULLU", "KHARDUNG_LA", 14, 1.0, "MOUNTAIN_PASS"),
            ("KHARDUNG_LA", "NORTH_PULLU", 16, 0.9, "MOUNTAIN_PASS"),
            ("NORTH_PULLU", "FSB_KHALSAR", 40, 1.1, "PAVED"),
            ("FSB_KHALSAR", "SASOMA", 92, 3.2, "UNPAVED_CORRIDOR"),
            ("SASOMA", "SIACHEN_KUMAR", 53, 2.8, "GLACIAL_TRAIL"),
            
            # DS-DBO Primary Arterial Axis (Through Murgo Choke Point)
            ("FSB_KHALSAR", "SHYOK_BEND", 42, 1.5, "STRATEGIC_HIGHWAY"),
            ("SHYOK_BEND", "MURGO_CHOKE", 98, 3.8, "CHOKE_POINT"),
            ("MURGO_CHOKE", "OP_DBO", 80, 3.2, "HIGH_ALTITUDE_FLAT"),

            # Alternate Western Shyok Ridge Bypass (Avoids Murgo)
            ("SHYOK_BEND", "SHYOK_BYPASS", 84, 3.5, "ALL_TERRAIN_BYPASS"),
            ("SHYOK_BYPASS", "OP_DBO", 122, 4.8, "ALL_TERRAIN_BYPASS"),

            # Eastern Sector
            ("HQ_LEH", "DEPOT_UPSHI", 48, 1.4, "PAVED_HIGHWAY"),
            ("DEPOT_UPSHI", "CHANG_LA", 58, 2.4, "MOUNTAIN_PASS"),
            ("CHANG_LA", "PANGONG_F4", 72, 3.1, "FRONTIER_AXIS")
        ]

        for u, v, dist, hrs, road_type in edges:
            self.graph.add_edge(u, v, distance_km=dist, base_time_hrs=hrs, road_type=road_type, penalty=1.0)

    def calculate_optimal_route(
        self, 
        origin: str, 
        destination: str, 
        blocked_nodes: Optional[List[str]] = None,
        weather_hazard_level: str = "NORMAL"
    ) -> Dict[str, Any]:
        """
        Calculates shortest, safest route using Dijkstra's algorithm.
        Applies exponential cost penalties to icy, high-hazard, or blocked corridors.
        """
        blocked_nodes = blocked_nodes or []
        
        # Clone working graph
        H = self.graph.copy()

        # Remove or penalize blocked passes
        for u, v, data in H.edges(data=True):
            edge_weight = data["distance_km"]

            # If pass involves a blocked node (e.g. Murgo avalanche)
            if u in blocked_nodes or v in blocked_nodes:
                edge_weight *= 1000.0  # Impassable barrier

            # Weather hazard impact
            if weather_hazard_level == "SEVERE_BLIZZARD":
                if data["road_type"] == "MOUNTAIN_PASS":
                    edge_weight *= 4.5
            elif weather_hazard_level == "CAUTION_ICE":
                if data["road_type"] in ["MOUNTAIN_PASS", "CHOKE_POINT"]:
                    edge_weight *= 1.8

            H[u][v]["weight"] = edge_weight

        try:
            path = nx.shortest_path(H, source=origin, target=destination, weight="weight")
            
            total_km = 0.0
            total_hrs = 0.0
            is_rerouted = False
            route_details = []

            for i in range(len(path) - 1):
                u, v = path[i], path[i + 1]
                edge_data = self.graph[u][v]
                total_km += edge_data["distance_km"]
                total_hrs += edge_data["base_time_hrs"]
                if "BYPASS" in u or "BYPASS" in v:
                    is_rerouted = True
                route_details.append({
                    "from": u,
                    "to": v,
                    "segment_km": edge_data["distance_km"],
                    "road_type": edge_data["road_type"]
                })

            waypoints = []
            elevations = []
            passes = []
            for node_id in path:
                n_data = self.graph.nodes[node_id]
                elev = n_data.get("elev", 3500)
                elevations.append(elev)
                if "Pass" in n_data.get("name", "") or "LA" in node_id:
                    passes.append(n_data.get("name", node_id))
                waypoints.append({
                    "node_id": node_id,
                    "name": n_data.get("name", node_id),
                    "lat": n_data.get("lat", 0.0),
                    "lng": n_data.get("lng", 0.0),
                    "elevation_m": elev
                })

            elevation_profile = {
                "max_altitude_m": max(elevations) if elevations else 0,
                "min_altitude_m": min(elevations) if elevations else 0,
                "total_climb_m": max(elevations) - min(elevations) if elevations else 0,
                "pass_crossings": passes
            }

            return {
                "status": "OPTIMAL_PATH_FOUND",
                "origin": origin,
                "destination": destination,
                "path_nodes": path,
                "total_distance_km": round(total_km, 1),
                "distance_km": round(total_km, 1),
                "estimated_transit_time_hrs": round(total_hrs, 1),
                "estimated_transit_hours": round(total_hrs, 1),
                "is_rerouted_alternate": is_rerouted,
                "hazard_rerouted": is_rerouted,
                "corridor_type": "ALTERNATE_ALL_TERRAIN_BYPASS" if is_rerouted else "PRIMARY_STRATEGIC_AXIS",
                "hazard_status": "REROUTED_CLEAR" if is_rerouted else "PRIMARY_OPEN",
                "waypoints": waypoints,
                "elevation_profile": elevation_profile,
                "segments": route_details
            }
        except nx.NetworkXNoPath:
            return {
                "status": "NO_PATH_EXISTS",
                "error": "No passable corridor found. Helidrop or pioneer road clearance required."
            }

route_optimizer = MilitaryRouteOptimizer()

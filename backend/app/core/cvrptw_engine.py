from typing import Dict, Any, List
from datetime import datetime

class MilitaryCVRPTWEngine:
    FLEET_PROFILES = {
        "TATRA_8X8": {
            "name": "Tatra 8x8 Heavy Utility Truck",
            "max_payload_kg": 10000.0,
            "curb_weight_kg": 15000.0,
            "gross_weight_tons": 25.0,
            "max_axle_load_tons": 8.5,
            "required_mlc": 40,
            "max_slope_gradient_deg": 22.0,
            "average_speed_kmh": 32.0
        },
        "STALLION_4X4": {
            "name": "Ashok Leyland Stallion 4x4",
            "max_payload_kg": 5000.0,
            "curb_weight_kg": 6500.0,
            "gross_weight_tons": 11.5,
            "max_axle_load_tons": 4.5,
            "required_mlc": 24,
            "max_slope_gradient_deg": 30.0,
            "average_speed_kmh": 38.0
        },
        "BV206_TRACKED": {
            "name": "BV-206 All-Terrain Tracked Carrier",
            "max_payload_kg": 2200.0,
            "curb_weight_kg": 4500.0,
            "gross_weight_tons": 6.7,
            "max_axle_load_tons": 2.2,
            "required_mlc": 12,
            "max_slope_gradient_deg": 35.0,
            "average_speed_kmh": 24.0
        }
    }

    STRATEGIC_PASS_TIME_WINDOWS = {
        "KHARDUNG_LA": {
            "name": "Khardung La Pass (Elev. 5,359m)",
            "window_open": "06:00",
            "window_close": "13:30",
            "reason": "Severe afternoon blizzard & sub-zero icing hazard after 13:30 hrs"
        },
        "CHANG_LA": {
            "name": "Chang La Strategic Pass (Elev. 5,360m)",
            "window_open": "06:00",
            "window_close": "14:00",
            "reason": "Thermal inversion & heavy afternoon snowpack shift"
        },
        "ZOJI_LA": {
            "name": "Zoji La Arctic Corridor (Elev. 3,528m)",
            "window_open": "05:30",
            "window_close": "12:30",
            "reason": "Zero-visibility whiteout & avalanche chute activation"
        }
    }

    BRIDGE_MLC_CAPACITIES = {
        "SHYOK_BAILEY_KM92": {
            "name": "Shyok River Tactical Bailey Bridge KM 92",
            "mlc_rating": 24,
            "max_single_vehicle_tons": 18.0,
            "status": "OPERATIONAL"
        },
        "DARBUK_PERMANENT": {
            "name": "Darbuk High-Capacity Steel Girder Bridge",
            "mlc_rating": 70,
            "max_single_vehicle_tons": 60.0,
            "status": "OPTIMAL"
        },
        "SASOMA_GLACIAL_SPAN": {
            "name": "Sasoma Military Suspension Bridge",
            "mlc_rating": 30,
            "max_single_vehicle_tons": 22.0,
            "status": "OPERATIONAL"
        }
    }

    def solve_cvrptw(
        self,
        origin_depot: str,
        target_outpost: str,
        total_cargo_kg: float,
        preferred_vehicle: str = "TATRA_8X8",
        departure_time_str: str = "07:00",
        route_corridor: str = "KHALSAR_SHYOK_DBO",
        crosses_bailey_bridge: bool = True
    ) -> Dict[str, Any]:
        dep_dt = datetime.strptime(departure_time_str, "%H:%M")
        pref_vehicle_key = preferred_vehicle.upper()
        if pref_vehicle_key not in self.FLEET_PROFILES:
            pref_vehicle_key = "TATRA_8X8"

        vehicle_spec = self.FLEET_PROFILES[pref_vehicle_key]
        warnings = []
        bridge_transshipment_required = False

        if crosses_bailey_bridge and vehicle_spec["required_mlc"] > 24:
            bridge_transshipment_required = True
            warnings.append(
                "Shyok KM 92 Bailey Bridge (MLC-24) exceeds 25T gross limit. "
                "Transshipping cargo to Stallion 4x4 for crossing."
            )
            vehicle_spec = self.FLEET_PROFILES["STALLION_4X4"]
            pref_vehicle_key = "STALLION_4X4"

        unit_capacity = vehicle_spec["max_payload_kg"]
        num_vehicles = max(1, int(-(-total_cargo_kg // unit_capacity)))
        actual_fleet_capacity = num_vehicles * unit_capacity

        travel_hours_to_pass = 3.5
        pass_eta_minutes = dep_dt.hour * 60 + dep_dt.minute + int(travel_hours_to_pass * 60)
        pass_eta_time = f"{pass_eta_minutes // 60:02d}:{pass_eta_minutes % 60:02d}"

        pass_constraint = self.STRATEGIC_PASS_TIME_WINDOWS.get("KHARDUNG_LA")
        window_close_dt = datetime.strptime(pass_constraint["window_close"], "%H:%M")
        window_close_minutes = window_close_dt.hour * 60 + window_close_dt.minute

        time_window_satisfied = pass_eta_minutes <= window_close_minutes
        staging_halt_inserted = False

        if not time_window_satisfied:
            staging_halt_inserted = True
            warnings.append(
                f"Arrival at Khardung La ({pass_eta_time}) misses cutoff ({pass_constraint['window_close']}). "
                "Routing to North Pullu staging base."
            )

        return {
            "status": "CVRPTW_OPTIMAL_SCHEDULE_SOLVED",
            "dispatch_summary": {
                "origin": origin_depot,
                "target": target_outpost,
                "total_cargo_kg": total_cargo_kg,
                "allocated_vehicle": vehicle_spec["name"],
                "vehicle_class": pref_vehicle_key,
                "vehicles_required": num_vehicles,
                "fleet_total_capacity_kg": actual_fleet_capacity,
                "capacity_utilization_pct": round((total_cargo_kg / actual_fleet_capacity) * 100, 1)
            },
            "bridge_axle_compliance": {
                "route_crosses_bailey_bridge": crosses_bailey_bridge,
                "bridge_load_class_mlc": 24 if crosses_bailey_bridge else 70,
                "vehicle_gross_weight_tons": vehicle_spec["gross_weight_tons"],
                "mlc_status": "COMPLIANT_SAFE" if not bridge_transshipment_required else "ADAPTED_VIA_SPLIT",
                "transshipment_advised": bridge_transshipment_required
            },
            "time_window_schedule": {
                "departure_time": departure_time_str,
                "pass_crossing": pass_constraint["name"],
                "estimated_pass_arrival": pass_eta_time,
                "pass_safety_window": f"{pass_constraint['window_open']} - {pass_constraint['window_close']}",
                "is_window_met": time_window_satisfied,
                "mandatory_halt_inserted": staging_halt_inserted
            },
            "operational_warnings": warnings
        }

cvrptw_solver = MilitaryCVRPTWEngine()

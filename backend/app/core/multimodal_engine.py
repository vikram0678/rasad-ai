from typing import Dict, Any, List

class TriModalLogisticsFusionEngine:
    AERIAL_PLATFORMS = {
        "IAF_C130J": {
            "name": "IAF C-130J Super Hercules",
            "max_payload_kg": 19000.0,
            "drop_method": "Heavy Parachute Low-Velocity Airdrop (LVAD)",
            "cruise_speed_kmh": 640.0,
            "service_ceiling_m": 8500,
            "cost_per_sortie_relative": 10.0
        },
        "IAF_AN32": {
            "name": "IAF An-32 Tactical Transporter",
            "max_payload_kg": 6700.0,
            "drop_method": "Platform Parachute Container Delivery System (CDS)",
            "cruise_speed_kmh": 450.0,
            "service_ceiling_m": 7600,
            "cost_per_sortie_relative": 4.5
        },
        "TACTICAL_UAV": {
            "name": "Autonomous Logistics Heavy-Lift Drone (Octocopter)",
            "max_payload_kg": 65.0,
            "drop_method": "Precision Winch / Soft Ground Touchdown",
            "cruise_speed_kmh": 85.0,
            "service_ceiling_m": 6000,
            "cost_per_sortie_relative": 0.5
        }
    }

    STRATEGIC_DROP_ZONES = {
        "OP_DBO": {
            "name": "Daulat Beg Oldi Advanced Landing Ground (DBO ALG)",
            "lat": 35.4022,
            "lng": 77.9297,
            "elevation_m": 5065,
            "air_drop_capable": True,
            "drone_pad_active": True
        },
        "SIACHEN_KUMAR": {
            "name": "Siachen Glacial Kumar Base Drop Zone",
            "lat": 35.1500,
            "lng": 77.2100,
            "elevation_m": 4880,
            "air_drop_capable": True,
            "drone_pad_active": True
        },
        "GALWAN_PP14": {
            "name": "Galwan Valley Forward Helipad & Drone Drop Point",
            "lat": 34.7800,
            "lng": 78.1800,
            "elevation_m": 4320,
            "air_drop_capable": False,
            "drone_pad_active": True
        }
    }

    def allocate_multimodal_mission(
        self,
        target_outpost: str,
        class1_rations_kg: float,
        class3_fuel_liters: float,
        class8_medical_kits: float,
        road_corridor_is_blocked: bool = False,
        airspace_wind_speed_kmh: float = 35.0
    ) -> Dict[str, Any]:
        total_cargo_mass_kg = class1_rations_kg + (class3_fuel_liters * 0.85) + (class8_medical_kits * 12.0)
        medical_mass_kg = class8_medical_kits * 12.0

        mission_allocation = []

        if not road_corridor_is_blocked:
            primary_modality = "TIER_1_GROUND_ROAD_CONVOY"
            mission_allocation.append({
                "modality": "GROUND_ROAD_CONVOY",
                "asset": "Tatra 8x8 / Stallion 4x4 Ground Convoy",
                "cargo_assigned_kg": total_cargo_mass_kg,
                "transit_time_hrs": 8.5,
                "flight_corridor": None,
                "rationale": "Surface mountain corridors are clear. Ground transport offers maximum tonnage and lowest operational cost."
            })
        else:
            primary_modality = "TRI_MODAL_AIR_BRIDGE"
            if medical_mass_kg > 0:
                drones_needed = max(1, int(-(-medical_mass_kg // 50.0)))
                mission_allocation.append({
                    "modality": "TIER_3_AUTONOMOUS_UAV_DRONE",
                    "asset": f"{drones_needed}x Heavy-Lift Autonomous Logistics Drone",
                    "cargo_assigned_kg": medical_mass_kg,
                    "target_drop_zone": self.STRATEGIC_DROP_ZONES.get(target_outpost, {}).get("name", "Forward Bunker Pad"),
                    "flight_time_minutes": 42.0,
                    "flight_corridor": "AIR-CORRIDOR-ECHO-SIAPU",
                    "rationale": "Emergency Class VIII medical and hypothermia kits routed via autonomous UAV directly to mountain ridge."
                })

            bulk_mass_kg = total_cargo_mass_kg - medical_mass_kg
            if bulk_mass_kg > 0:
                c130_sorties = max(1, int(-(-bulk_mass_kg // 15000.0)))
                mission_allocation.append({
                    "modality": "TIER_2_IAF_FIXED_WING_AIRDROP",
                    "asset": f"{c130_sorties}x IAF C-130J Super Hercules",
                    "cargo_assigned_kg": bulk_mass_kg,
                    "drop_zone": self.STRATEGIC_DROP_ZONES.get(target_outpost, {}).get("name", "DBO Advanced Landing Ground (ALG)"),
                    "flight_time_minutes": 58.0,
                    "flight_corridor": "AIR-CORRIDOR-LADAKH-NORTH-BRAVO",
                    "rationale": "Road corridor severed by snowpack/avalanche. Triggering Northern Command Emergency Air-Bridge Sorties."
                })

        return {
            "status": "MULTIMODAL_MISSION_SYNTHESIZED",
            "primary_modality": primary_modality,
            "target_outpost": target_outpost,
            "total_cargo_mass_kg": round(total_cargo_mass_kg, 1),
            "surface_corridor_status": "BLOCKED_BY_AVALANCHE" if road_corridor_is_blocked else "CLEAR",
            "airspace_flyable": airspace_wind_speed_kmh < 65.0,
            "allocated_legs": mission_allocation,
            "air_corridors_active": [
                {
                    "corridor_id": "AIR-CORRIDOR-LADAKH-NORTH-BRAVO",
                    "origin": "Air Force Station Leh (VILH)",
                    "destination": "DBO Advanced Landing Ground (ALG)",
                    "altitude_floor_m": 7200,
                    "nav_beacons": ["LEH-VOR", "SASOMA-BEACON", "DBO-NDB"]
                },
                {
                    "corridor_id": "AIR-CORRIDOR-ECHO-SIAPU",
                    "origin": "Forward Staging Base Khalsar Drone Pad",
                    "destination": "Siachen Kumar / Galwan FOP",
                    "altitude_floor_m": 5800,
                    "nav_beacons": ["SHYOK-RIDGE", "GALWAN-CONFLUENCE"]
                }
            ]
        }

multimodal_engine = TriModalLogisticsFusionEngine()

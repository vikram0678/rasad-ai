import math
from typing import Dict, Any, List

class MilitaryDemandForecastingEngine:
    """
    Indian Army Predictive Logistics Demand Model
    Calculates multi-stream consumption burn rates for forward outposts
    based on troops garrisoned, altitude, sub-zero ambient temperature, 
    and threat tempo.
    """
    
    # Baseline daily consumption per soldier under standard conditions (sea-level, 15°C, peace)
    BASE_RATES = {
        "class1_rations_kg": 2.2,     # High-calorie high-altitude field ration
        "class3_kerosene_l": 2.5,     # Heating bukhari & cooking fuel
        "class5_ammo_rounds": 1.5,    # Standard defensive patrol expenditure
        "class8_medical_kits": 0.02   # Routine sick-bay requirements
    }

    def predict_daily_burn(self, troops: int, altitude_m: float, ambient_temp_c: float, defcon_level: int = 2) -> Dict[str, Any]:
        """
        Predicts consumption burn rate for a single forward outpost.
        """
        # Altitude Hypoxia & Cold Factor: Caloric needs increase ~2% every 500m above 3,000m
        alt_factor = 1.0 + max(0.0, (altitude_m - 3000.0) / 500.0) * 0.035
        
        # Sub-zero Temperature Kerosene Multiplier:
        # Below 0°C, bukhari stoves burn continuous heating kerosene (Class III)
        # At -20°C, fuel burn increases drastically to prevent hypothermia and freeze
        cold_delta = max(0.0, -ambient_temp_c)
        temp_fuel_multiplier = 1.0 + (cold_delta * 0.045)  # +45% per 10°C drop
        
        # Defcon / Operational Tempo Multiplier for Ammunition (Class V)
        ammo_multiplier = {
            1: 8.5,  # War / Active skirmish
            2: 2.8,  # High Alert
            3: 1.4,  # Elevated Vigil
            4: 1.0   # Peacetime routine
        }.get(defcon_level, 2.0)

        daily_rations_kg = round(troops * self.BASE_RATES["class1_rations_kg"] * alt_factor, 1)
        daily_kerosene_l = round(troops * self.BASE_RATES["class3_kerosene_l"] * temp_fuel_multiplier, 1)
        daily_ammo_rounds = round(troops * self.BASE_RATES["class5_ammo_rounds"] * ammo_multiplier)
        daily_medical_kits = max(1, round(troops * self.BASE_RATES["class8_medical_kits"] * (1.0 + cold_delta * 0.02)))

        return {
            "troops": troops,
            "altitude_m": altitude_m,
            "ambient_temp_c": ambient_temp_c,
            "defcon_level": defcon_level,
            "daily_burn": {
                "class1_rations_kg": daily_rations_kg,
                "class3_pol_liters": daily_kerosene_l,
                "class5_ammo_rounds": daily_ammo_rounds,
                "class8_medical_kits": daily_medical_kits
            },
            "explainability_drivers": [
                {
                    "factor": f"Ambient Temperature ({ambient_temp_c}°C)",
                    "impact": f"+{round((temp_fuel_multiplier - 1.0) * 100)}% Kerosene Burn Rate",
                    "severity": "HIGH" if ambient_temp_c < -15 else "NORMAL"
                },
                {
                    "factor": f"High-Altitude ({round(altitude_m)} m)",
                    "impact": f"+{round((alt_factor - 1.0) * 100)}% Caloric Dietary Requirement",
                    "severity": "HIGH" if altitude_m > 4500 else "NORMAL"
                },
                {
                    "factor": f"Readiness Posture (DEFCON-{defcon_level})",
                    "impact": f"{ammo_multiplier}x Combat Stock Expenditure Factor",
                    "severity": "HIGH" if defcon_level <= 2 else "NORMAL"
                }
            ]
        }

    def calculate_days_of_supply(self, current_stock: Dict[str, float], daily_burn: Dict[str, float]) -> Dict[str, Any]:
        """
        Calculates Days of Supply (DOS) remaining for each supply class.
        The overall post DOS is dictated by the most critical bottleneck.
        """
        dos_map = {}
        critical_threshold = 5.0 # Days

        for key, curr in current_stock.items():
            burn = daily_burn.get(key, 1.0)
            dos = round(curr / max(burn, 0.001), 1)
            dos_map[key] = {
                "current_stock": curr,
                "daily_burn": burn,
                "days_remaining": dos,
                "is_critical": dos < critical_threshold
            }

        min_dos = min(item["days_remaining"] for item in dos_map.values())
        status = "OPTIMAL"
        if min_dos < 4.0:
            status = "CRITICAL"
        elif min_dos < 7.0:
            status = "WARNING"

        return {
            "overall_days_of_supply": min_dos,
            "health_status": status,
            "classes": dos_map
        }

demand_engine = MilitaryDemandForecastingEngine()

from typing import Dict, Any, List

class MilitaryXAIEngine:
    def compute_feature_attribution(
        self,
        troops: int,
        altitude_m: float,
        ambient_temp_c: float,
        defcon_level: int,
        snow_depth_cm: float,
        wind_speed_kmh: float,
        total_predicted_rations_kg: float,
        total_predicted_fuel_liters: float
    ) -> Dict[str, Any]:
        baseline_rations_per_man = 2.4
        baseline_fuel_per_man = 3.0

        baseline_total_rations = troops * baseline_rations_per_man
        baseline_total_fuel = troops * baseline_fuel_per_man

        subzero_degrees = max(0.0, -ambient_temp_c)
        cold_fuel_impact = troops * (subzero_degrees * 0.18)
        cold_ration_impact = troops * (subzero_degrees * 0.015)

        altitude_excess = max(0.0, altitude_m - 2000.0)
        altitude_fuel_impact = troops * (altitude_excess / 1000.0 * 0.25)
        altitude_ration_impact = troops * (altitude_excess / 1000.0 * 0.08)

        defcon_scale = {1: 1.6, 2: 1.35, 3: 1.15, 4: 1.05, 5: 1.0}
        posture_mult = defcon_scale.get(defcon_level, 1.2) - 1.0
        defcon_fuel_impact = baseline_total_fuel * posture_mult
        defcon_ration_impact = baseline_total_rations * posture_mult

        snow_impact_fuel = (snow_depth_cm / 50.0) * (troops * 0.4)
        snow_impact_rations = (snow_depth_cm / 50.0) * (troops * 0.02)

        total_fuel_delta = cold_fuel_impact + altitude_fuel_impact + defcon_fuel_impact + snow_impact_fuel
        if total_fuel_delta <= 0:
            total_fuel_delta = 1.0

        fuel_shap_breakdown = [
            {
                "feature": "Sub-Zero Temperature",
                "value": f"{ambient_temp_c}°C",
                "delta_liters": round(cold_fuel_impact, 1),
                "contribution_pct": round((cold_fuel_impact / total_fuel_delta) * 100, 1),
                "tactical_driver": "Continuous Arctic Bukhari stove space heating to prevent frostbite."
            },
            {
                "feature": "High-Altitude Hypoxia",
                "value": f"{altitude_m:.0f}m",
                "delta_liters": round(altitude_fuel_impact, 1),
                "contribution_pct": round((altitude_fuel_impact / total_fuel_delta) * 100, 1),
                "tactical_driver": "Atmospheric oxygen starvation causes 35% de-rating of generator efficiency."
            },
            {
                "feature": "DEFCON Operational Alert",
                "value": f"DEFCON {defcon_level}",
                "delta_liters": round(defcon_fuel_impact, 1),
                "contribution_pct": round((defcon_fuel_impact / total_fuel_delta) * 100, 1),
                "tactical_driver": "Heightened combat readiness buffer mandated by Northern Command Annexure-4."
            },
            {
                "feature": "Snowpack Terrain Drag",
                "value": f"{snow_depth_cm:.0f}cm",
                "delta_liters": round(snow_impact_fuel, 1),
                "contribution_pct": round((snow_impact_fuel / total_fuel_delta) * 100, 1),
                "tactical_driver": "Increased idling fuel burn and mechanical snow-clearing rotary equipment usage."
            }
        ]

        fuel_shap_breakdown.sort(key=lambda x: x["contribution_pct"], reverse=True)

        top_driver = fuel_shap_breakdown[0]
        second_driver = fuel_shap_breakdown[1]
        commanders_rationale = (
            f"DISPATCH REASONING: The primary demand driver is {top_driver['feature']} ({top_driver['value']}), "
            f"accounting for {top_driver['contribution_pct']}% of elevated consumption ({top_driver['delta_liters']} L), "
            f"followed by {second_driver['feature']} ({second_driver['contribution_pct']}%). "
            f"Standard peacetime quotas are insufficient; elevated resupply is required to maintain survival reserves."
        )

        return {
            "prediction_target": "Class III Arctic POL / Fuel & Heating",
            "base_unadjusted_consumption": round(baseline_total_fuel, 1),
            "final_predicted_consumption": round(total_predicted_fuel_liters, 1),
            "additive_environmental_delta": round(total_fuel_delta, 1),
            "commanders_rationale": commanders_rationale,
            "feature_attribution_waterfall": fuel_shap_breakdown
        }

xai_engine = MilitaryXAIEngine()

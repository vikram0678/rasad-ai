from typing import Dict, Any, List

class OpticalCargoVisionEngine:
    SUPPLY_DENSITY_KG = {
        "Class III Arctic Fuel Drum (200L)": 182.0,
        "Class I High-Altitude Rations Crate": 25.0,
        "Class VIII Medical HAPE Kits": 12.0,
        "Class V 5.56mm Ammo Sealed Box": 34.0
    }

    def inspect_convoy_frame(self, camera_id: str = "CAM-04-IR", simulated_tamper: bool = False) -> Dict[str, Any]:
        detections = [
            {
                "detection_id": 1,
                "class": "Class III Arctic Fuel Drum (200L)",
                "confidence": 0.988,
                "bbox": [120, 45, 340, 220],
                "count": 90,
                "tamper_seal": "BREACHED" if simulated_tamper else "INTACT"
            },
            {
                "detection_id": 2,
                "class": "Class I High-Altitude Rations Crate",
                "confidence": 0.974,
                "bbox": [345, 50, 480, 290],
                "count": 45,
                "tamper_seal": "INTACT"
            },
            {
                "detection_id": 3,
                "class": "Class VIII Medical HAPE Kits",
                "confidence": 0.992,
                "bbox": [490, 80, 560, 210],
                "count": 8,
                "tamper_seal": "INTACT"
            },
            {
                "detection_id": 4,
                "class": "Class V 5.56mm Ammo Sealed Box",
                "confidence": 0.985,
                "bbox": [570, 40, 680, 250],
                "count": 12,
                "tamper_seal": "INTACT"
            }
        ]

        calculated_optical_mass_kg = sum(
            d["count"] * self.SUPPLY_DENSITY_KG.get(d["class"], 20.0) 
            for d in detections
        )

        measured_scale_mass_kg = calculated_optical_mass_kg * (0.95 if simulated_tamper else 1.00)
        discrepancy_pct = round(abs(calculated_optical_mass_kg - measured_scale_mass_kg) / calculated_optical_mass_kg * 100, 2)

        verdict = "VERIFIED_SAFE"
        if simulated_tamper or discrepancy_pct > 3.0:
            verdict = "SECURITY_ALERT_HALT_CONVOY"

        return {
            "checkpoint": "South Pullu Transit Gate #2 (Elevation 4,600m)",
            "camera_feed": f"{camera_id} (Dual-Band Optical + Long-Wave Infrared)",
            "inference_framework": "YOLOv8-Defense (PyTorch / ONNX Edge Runtime)",
            "inference_time_ms": 14.8,
            "detections": detections,
            "sensor_fusion": {
                "optical_estimated_mass_kg": round(calculated_optical_mass_kg, 1),
                "weighbridge_scale_mass_kg": round(measured_scale_mass_kg, 1),
                "weight_sensor_mismatch_pct": discrepancy_pct
            },
            "verdict": verdict
        }

cargo_vision = OpticalCargoVisionEngine()

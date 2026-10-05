from fastapi import APIRouter
from app.schemas.cargo import CargoManifestResponse
from typing import Dict, Any

router = APIRouter(tags=["YOLOv8 Optical Cargo Inspection"])

@router.get(
    "/cargo/cv_manifest",
    response_model=CargoManifestResponse,
    summary="YOLOv8 Optical Checkpoint Cargo Scan",
    description="Simulates automated optical crate counting, barrel detection, RFID cross-check, and weight bridge sensor balance at high-altitude transit checkposts."
)
def get_cargo_inspection():
    return {
        "checkpoint": "South Pullu Transit Gate #2",
        "camera_feed": "CAM-04 (Infrared + Optical)",
        "scan_status": "COMPLETED",
        "yolo_detections": [
            {"class": "Class III Arctic Fuel Drum (200L)", "count": 90, "confidence": 0.987, "tamper_seal": "INTACT"},
            {"class": "Class I High-Altitude Rations", "count": 45, "confidence": 0.972, "tamper_seal": "INTACT"},
            {"class": "Class VIII Medical HAPE Kits", "count": 8, "confidence": 0.991, "tamper_seal": "INTACT"},
            {"class": "Class V 5.56mm Ammo Sealed", "count": 12, "confidence": 0.984, "tamper_seal": "INTACT"}
        ],
        "weight_sensor_mismatch_pct": 0.0,
        "verdict": "VERIFIED_SAFE"
    }

@router.get(
    "/cargo/simulate_anomaly",
    summary="Simulate Cargo Tamper / Discrepancy Alert",
    description="Demonstrates automated detection of cargo seal tampering and weight variance."
)
def simulate_cargo_anomaly():
    return {
        "checkpoint": "North Pullu Transit Gate #1",
        "camera_feed": "CAM-02 (Optical)",
        "scan_status": "FLAGGED_DISCREPANCY",
        "yolo_detections": [
            {"class": "Class III Arctic Fuel Drum (200L)", "count": 86, "confidence": 0.975, "tamper_seal": "BREACHED"},
            {"class": "Class I High-Altitude Rations", "count": 45, "confidence": 0.965, "tamper_seal": "INTACT"}
        ],
        "weight_sensor_mismatch_pct": 4.8,
        "verdict": "SECURITY_ALERT_HALT_CONVOY"
    }

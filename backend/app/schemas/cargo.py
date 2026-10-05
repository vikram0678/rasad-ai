from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class YoloDetectionItem(BaseModel):
    class_name: str = Field(..., alias="class", description="Identified military supply item")
    count: int = Field(..., description="Detected unit count")
    confidence: float = Field(..., description="Model inference confidence (0.0 to 1.0)")
    tamper_seal: str = Field(..., description="Tamper evident seal status: INTACT or BREACHED")

class CargoManifestResponse(BaseModel):
    checkpoint: str
    camera_feed: str
    scan_status: str
    yolo_detections: List[Dict[str, Any]]
    weight_sensor_mismatch_pct: float
    verdict: str

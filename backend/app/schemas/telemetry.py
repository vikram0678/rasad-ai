from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

class SystemHealthResponse(BaseModel):
    status: str = Field("OPERATIONAL", example="OPERATIONAL")
    service: str = Field("RASAD-AI Predictive Logistics Core", example="RASAD-AI Predictive Logistics Core")
    command_corps: str = Field("HQ 14 Corps Northern Command (Ladakh Sector)", example="HQ 14 Corps Northern Command (Ladakh Sector)")
    satellite_mesh: str = Field("RISAT-2B ONLINE", example="RISAT-2B ONLINE")
    ml_model_status: str = Field("LOADED_CALIBRATED", example="LOADED_CALIBRATED")
    model_mae: Optional[float] = Field(None, example=12.4)
    version: str = Field("2.4.0-DEFENSE", example="2.4.0-DEFENSE")
    uptime_seconds: Optional[float] = Field(None, example=3600.0)

class DiagnosticsSubsystem(BaseModel):
    subsystem: str
    status: str
    latency_ms: Optional[float] = None
    details: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class DeepDiagnosticReport(BaseModel):
    status: str = Field(..., example="ALL_SYSTEMS_GO")
    timestamp: str
    total_checks: int
    passed_checks: int
    uptime_seconds: float
    python_version: str
    environment: str
    subsystems: List[DiagnosticsSubsystem]

class AARSummary(BaseModel):
    total_dispatches: int
    approved_convoys: int
    rejected_convoys: int
    total_tonnage_moved_kg: float
    critical_posts_alert_count: int

class AARReportResponse(BaseModel):
    timestamp: str
    report_id: Optional[str] = None
    audit_summary: AARSummary
    convoys_cleared: List[Dict[str, Any]]
    active_stockouts_prevented: List[str]
    system_readiness: str
    conclusions: Optional[str] = None

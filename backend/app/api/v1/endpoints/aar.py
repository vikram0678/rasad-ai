from fastapi import APIRouter
from app.schemas.telemetry import AARReportResponse
from app.core.database import tactical_db

router = APIRouter(tags=["After-Action Review (AAR) & Auditing"])

@router.get(
    "/aar/report",
    response_model=AARReportResponse,
    summary="Generate After-Action Review (AAR) Report",
    description="Synthesizes dispatch audits, stockout interventions, convoy tonnage moved, and operational readiness for commanding officers."
)
def get_after_action_review():
    return tactical_db.generate_aar_report()

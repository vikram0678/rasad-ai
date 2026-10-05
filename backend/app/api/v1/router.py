from fastapi import APIRouter
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.demand import router as demand_router
from app.api.v1.endpoints.routes import router as routes_router
from app.api.v1.endpoints.guardrails import router as guardrails_router
from app.api.v1.endpoints.copilot import router as copilot_router
from app.api.v1.endpoints.cargo import router as cargo_router
from app.api.v1.endpoints.aar import router as aar_router
from app.api.v1.endpoints.security_api import router as security_router
from app.api.v1.endpoints.federated_api import router as federated_router
from app.api.v1.endpoints.semantic_api import router as semantic_router
from app.api.v1.endpoints.sql_api import router as sql_router
from app.api.v1.endpoints.cvrptw_api import router as cvrptw_router
from app.api.v1.endpoints.xai_api import router as xai_router
from app.api.v1.endpoints.multimodal_api import router as multimodal_router
from app.api.v1.endpoints.ew_api import router as ew_router
from app.api.v1.endpoints.resilience_simulator import router as resilience_router
from app.api.v1.endpoints.rasad_sahayak import router as rasad_sahayak_router

api_v1_router = APIRouter()

# Mount all domain sub-routers
api_v1_router.include_router(health_router)
api_v1_router.include_router(demand_router)
api_v1_router.include_router(routes_router)
api_v1_router.include_router(guardrails_router)
api_v1_router.include_router(copilot_router)
api_v1_router.include_router(cargo_router)
api_v1_router.include_router(aar_router)
api_v1_router.include_router(security_router)
api_v1_router.include_router(federated_router)
api_v1_router.include_router(semantic_router)
api_v1_router.include_router(sql_router)
api_v1_router.include_router(cvrptw_router)
api_v1_router.include_router(xai_router)
api_v1_router.include_router(multimodal_router)
api_v1_router.include_router(ew_router)
api_v1_router.include_router(resilience_router)
api_v1_router.include_router(rasad_sahayak_router)

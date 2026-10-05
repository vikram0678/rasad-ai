import asyncio
import time
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_v1_router
from app.core.middleware import OperationalTimingMiddleware, setup_exception_handlers

app = FastAPI(
    title="RASAD-AI API Core",
    description="Predictive Logistics & Forward Supply Chain Management System",
    version="2.4.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(OperationalTimingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_exception_handlers(app)

app.include_router(api_v1_router, prefix="/api")
app.include_router(api_v1_router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "status": "OPERATIONAL",
        "system": "RASAD-AI Predictive Logistics Core",
        "theater": "Northern Command Ladakh Sector",
        "version": "2.4.0",
        "interactive_docs": "/docs",
        "redoc_docs": "/redoc",
        "health_endpoint": "/api/health",
        "diagnostics_endpoint": "/api/diagnostics",
        "frontend_ui": "http://localhost:5173"
    }

@app.get("/ws/telemetry")
def telemetry_poll():
    return {
        "status": "TELEMETRY_LINK_ONLINE",
        "timestamp": time.time(),
        "mesh_status": "VHF_LINK_LOCKED",
        "satellite": "RISAT-2B"
    }

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await asyncio.sleep(2.0)
            await websocket.send_json({
                "type": "TELEMETRY_BEAT",
                "timestamp": time.time(),
                "mesh_status": "VHF_LINK_LOCKED",
                "satellite": "RISAT-2B"
            })
    except (WebSocketDisconnect, Exception):
        pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

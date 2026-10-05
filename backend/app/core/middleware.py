import time
import uuid
import logging
from datetime import datetime, timezone
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.exceptions import MilitaryLogisticsException

logger = logging.getLogger("rasad_api")
logger.setLevel(logging.INFO)
if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [RASAD-DEFENSE] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    ch.setFormatter(formatter)
    logger.addHandler(ch)

class OperationalTimingMiddleware(BaseHTTPMiddleware):
    """
    Measures endpoint latency, assigns unique military dispatch tracking IDs,
    and sets defense security headers on every response.
    """
    async def dispatch(self, request: Request, call_next):
        req_id = request.headers.get("X-Request-ID", f"REQ-{uuid.uuid4().hex[:8].upper()}")
        start_time = time.perf_counter()

        # Attach request ID to request state
        request.state.request_id = req_id

        try:
            response: Response = await call_next(request)
            process_time = (time.perf_counter() - start_time) * 1000.0
            
            # Set tactical telemetry headers
            response.headers["X-Request-ID"] = req_id
            response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
            response.headers["X-Theater-Sector"] = "NORTHERN_COMMAND_LADAKH"
            response.headers["X-Defense-Classification"] = "RESTRICTED_OFFICIAL"

            if request.url.path not in ["/api/health", "/docs", "/openapi.json"]:
                logger.info(
                    f"{request.method} {request.url.path} | Status: {response.status_code} | Latency: {process_time:.2f}ms | Trace: {req_id}"
                )
            return response

        except Exception as exc:
            process_time = (time.perf_counter() - start_time) * 1000.0
            logger.error(f"UNHANDLED EXCEPTION on {request.method} {request.url.path}: {str(exc)} | Trace: {req_id}")
            raise exc

def setup_exception_handlers(app):
    """
    Registers clean JSON exception handlers for custom domain exceptions,
    FastAPI validation errors, and general exceptions for seamless debugging.
    """
    @app.exception_handler(MilitaryLogisticsException)
    async def military_exception_handler(request: Request, exc: MilitaryLogisticsException):
        req_id = getattr(request.state, "request_id", "REQ-UNKNOWN")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": {
                    "error_code": exc.error_code,
                    "detail": exc.message,
                    "suggestion": exc.suggestion,
                    "context": exc.context
                },
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "request_id": req_id
            },
            headers={"X-Request-ID": req_id}
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        req_id = getattr(request.state, "request_id", "REQ-UNKNOWN")
        formatted_errors = []
        for err in exc.errors():
            formatted_errors.append({
                "loc": " -> ".join(str(loc) for loc in err.get("loc", [])),
                "msg": err.get("msg"),
                "type": err.get("type")
            })
        
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "error": {
                    "error_code": "REQUEST_VALIDATION_ERROR",
                    "detail": "Input payload failed military parameter validation rules.",
                    "suggestion": "Check field types, bounds, and required keys in /docs schema.",
                    "context": {"validation_errors": formatted_errors}
                },
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "request_id": req_id
            },
            headers={"X-Request-ID": req_id}
        )

    @app.exception_handler(StarletteHTTPException)
    async def starlette_http_exception_handler(request: Request, exc: StarletteHTTPException):
        req_id = getattr(request.state, "request_id", "REQ-UNKNOWN")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": {
                    "error_code": f"HTTP_{exc.status_code}",
                    "detail": exc.detail,
                    "suggestion": "Verify endpoint URL or HTTP headers.",
                    "context": {}
                },
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "request_id": req_id
            },
            headers={"X-Request-ID": req_id}
        )

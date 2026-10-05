"""
Compatibility Router - Re-exports API v1 routes across /api/... and /api/v1/...
"""
from fastapi import APIRouter
from app.api.v1.router import api_v1_router

# Direct exposure on /api
router = api_v1_router

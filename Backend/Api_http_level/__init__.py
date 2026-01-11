# Backend/api/__init__.py
"""
API Layer initializer.

Exposes all route modules for ingestion, data retrieval, analytics, and AI.
"""

from Backend.Api_http_level.ingestion_routes import router as ingestion_router
from Backend.Api_http_level.data_routes import router as data_router
from Backend.Api_http_level.analytic_routes import router as analytics_router
from Backend.Api_http_level.AI_routes import router as ai_router

__all__ = [
    "ingestion_router",
    "data_router",
    "analytics_router",
    "ai_router",
]

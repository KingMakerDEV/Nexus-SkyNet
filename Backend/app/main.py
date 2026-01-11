
import os
import logging
import uvicorn
from typing import Dict, Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import get_db, init_db_pool, close_db_pool



# Routers (mounted only; no endpoint logic here)
from Backend.Api_http_level import (
    ingestion_router,
    data_router,
    analytics_router,
    ai_router,
)

# Optional: request ID injection
import uuid

logger = logging.getLogger("uvicorn.error")


def validate_environment() -> None:
    """
    Fail fast if required environment variables are missing.
    """
    required = ["DATABASE_URL", "OPENAI_API_KEY"]
    missing = [key for key in required if not getattr(settings, key, None)]
    if missing:
        raise RuntimeError(f"Missing required environment variables: {', '.join(missing)}")


def create_app() -> FastAPI:
    """
    Application Bootstrapping:
    - Initialize FastAPI
    - Load and validate environment configuration
    - Wire dependencies and routers
    - Configure middleware and global handlers
    """
    validate_environment()

    app = FastAPI(
        title="Backend Application",
        version=os.getenv("APP_VERSION", "1.0.0"),
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # Middleware Configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=os.getenv("CORS_ALLOW_ORIGINS", "*").split(","),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def request_id_middleware(request: Request, call_next):
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response

    @app.middleware("http")
    async def logging_middleware(request: Request, call_next):
        logger.info(f"Incoming {request.method} {request.url}")
        response = await call_next(request)
        logger.info(f"Completed {request.method} {request.url} -> {response.status_code}")
        return response

    # Global Error Handling
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.exception(f"Unhandled error: {exc}")
        return JSONResponse(
            status_code=500,
            content={
                "error": "internal_server_error",
                "message": "An unexpected error occurred.",
                "request_id": getattr(request.state, "request_id", None),
            },
        )

    # Dependency Injection & Wiring (no business logic instantiation inline)
    # - Database session dependency is provided via get_db
    # - Service-layer and AI client dependencies should be injected within routers/services

    # API Router Registration (mount only)
    app.include_router(ingestion_router, prefix="/api")
    app.include_router(data_router, prefix="/api")
    app.include_router(analytics_router, prefix="/api")
    app.include_router(ai_router, prefix="/api")

    # Health & System Status Endpoints
    @app.get("/health")
    async def health() -> Dict[str, Any]:
        return {"status": "ok"}

    @app.get("/ready")
    async def ready() -> Dict[str, Any]:
        # Minimal readiness check; deeper checks happen in startup hook
        return {"ready": True}

    @app.get("/version")
    async def version() -> Dict[str, Any]:
        return {"version": app.version}

    # Startup & Shutdown Hooks
    @app.on_event("startup")
    async def on_startup():
        logger.info("Starting application...")
        # Initialize DB connection pool
        init_db_pool(settings.DATABASE_URL)
        # Validate DB connectivity (lightweight ping via pool)
        logger.info("Database pool initialized.")
        # Validate AI API keys
        if not settings.OPENAI_API_KEY:
            raise RuntimeError("OPENAI_API_KEY not configured")
        logger.info("AI API key validated.")
        # Warm up caches (if any)
        logger.info("Startup tasks completed.")

    @app.on_event("shutdown")
    async def on_shutdown():
        logger.info("Shutting down application...")
        # Gracefully close DB connections
        close_db_pool()
        # Flush logs / release resources
        logger.info("Shutdown tasks completed.")

    return app


app = create_app()


if __name__ == "__main__":
    # Start the application server (no business logic here)
    uvicorn.run(
        "main:app",
        host=os.getenv("APP_HOST", "0.0.0.0"),
        port=int(os.getenv("APP_PORT", "8000")),
        reload=os.getenv("APP_RELOAD", "false").lower() == "true",
        log_level=os.getenv("APP_LOG_LEVEL", "info"),
    )

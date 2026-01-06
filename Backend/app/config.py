
import os
from functools import lru_cache
from typing import List, Optional

from dotenv import load_dotenv
from pydantic import BaseSettings, AnyUrl, Field, validator


# Load variables from .env early so BaseSettings can read them
ENV_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(dotenv_path=ENV_PATH, override=False)


class PostgresDsn(AnyUrl):
    """
    Restrict DSN to PostgreSQL URLs.
    Example: postgresql+psycopg2://user:pass@host:5432/dbname
    """
    allowed_schemes = {"postgresql", "postgresql+psycopg2", "postgres", "postgres+psycopg2"}


class Settings(BaseSettings):
    # -----------------------------------------------------------------------------
    # Core environment
    # -----------------------------------------------------------------------------
    ENV: str = Field(default="development", description="Environment name: development|staging|production")
    DEBUG: bool = Field(default=True, description="Enable debug features and verbose logging")
    APP_NAME: str = Field(default="Nexus SkyNet", description="Human-readable application name")
    VERSION: str = Field(default="0.1.0", description="Application version")
    NASA_API_KEY: Optional[str] = Field(default=None, description="NASA Image and Video Library API key")
    NASA_API_BASE_URL: str = Field(default="https://images-api.nasa.gov", description="NASA API base URL")


    # -----------------------------------------------------------------------------
    # Server configuration
    # -----------------------------------------------------------------------------
    HOST: str = Field(default="0.0.0.0", description="Server bind host")
    PORT: int = Field(default=8000, description="Server bind port")
    ALLOWED_HOSTS: List[str] = Field(default=["*"], description="Allowed hosts for requests")
    CORS_ORIGINS: List[str] = Field(default=["*"], description="Allowed CORS origins")
    CORS_METHODS: List[str] = Field(default=["GET", "POST", "PUT", "DELETE", "OPTIONS"], description="Allowed CORS methods")
    CORS_HEADERS: List[str] = Field(default=["*"], description="Allowed CORS headers")

    # -----------------------------------------------------------------------------
    # Database
    # -----------------------------------------------------------------------------
    DATABASE_URL: PostgresDsn = Field(..., description="PostgreSQL connection string (DSN)")
    DB_POOL_MIN_SIZE: int = Field(default=2, description="Minimum DB connection pool size")
    DB_POOL_MAX_SIZE: int = Field(default=10, description="Maximum DB connection pool size")
    DB_ECHO_SQL: bool = Field(default=False, description="Echo SQL statements for debugging")

    # Optional decomposed DB fields (used if DATABASE_URL is missing; we compose it)
    DB_USER: Optional[str] = None
    DB_PASSWORD: Optional[str] = None
    DB_HOST: Optional[str] = None
    DB_PORT: Optional[int] = None
    DB_NAME: Optional[str] = None

    # -----------------------------------------------------------------------------
    # External APIs (astronomy + optional AI)
    # -----------------------------------------------------------------------------
    ASTRONOMY_API_KEY: Optional[str] = Field(default=None, description="Key for external astronomy data provider")
    ASTRONOMY_API_BASE_URL: Optional[str] = Field(default=None, description="Base URL for astronomy API")
    ASTRONOMY_API_TIMEOUT_SECONDS: int = Field(default=20, description="HTTP timeout for astronomy API calls")

    LLM_PROVIDER: Optional[str] = Field(default=None, description="e.g., openai|azure|anthropic")
    LLM_API_KEY: Optional[str] = Field(default=None, description="LLM API key")
    LLM_MODEL: Optional[str] = Field(default=None, description="Default model name")
    LLM_MAX_TOKENS: int = Field(default=2048, description="Token cap for AI responses")
    LLM_TEMPERATURE: float = Field(default=0.2, ge=0.0, le=1.0, description="Sampling temperature for AI")

    # -----------------------------------------------------------------------------
    # Data & analytics
    # -----------------------------------------------------------------------------
    DEFAULT_PAGE_SIZE: int = Field(default=50, description="Default pagination size for list endpoints")
    MAX_PAGE_SIZE: int = Field(default=500, description="Max pagination size to prevent abuse")
    NUMERIC_TOLERANCE: float = Field(default=1e-9, description="Float tolerance used in comparisons")
    AGGREGATION_PRECISION: int = Field(default=6, description="Decimal places in aggregated outputs")

    # -----------------------------------------------------------------------------
    # Observability
    # -----------------------------------------------------------------------------
    LOG_LEVEL: str = Field(default="INFO", description="Log level: DEBUG|INFO|WARNING|ERROR|CRITICAL")
    REQUEST_LOGGING_ENABLED: bool = Field(default=True, description="Log incoming HTTP requests")
    SQL_LOGGING_ENABLED: bool = Field(default=False, description="Log SQL statements (overrides DB_ECHO_SQL)")

    # -----------------------------------------------------------------------------
    # Security and safety
    # -----------------------------------------------------------------------------
    ENABLE_RATE_LIMITS: bool = Field(default=True, description="Enable rate limiting on public APIs")
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = Field(default=120, description="Requests per minute threshold")
    ENABLE_DATA_SANITIZATION: bool = Field(default=True, description="Sanitize/validate any external input aggressively")
    TRUST_PROXY_HEADERS: bool = Field(default=False, description="Honor X-Forwarded-* headers (for reverse proxies)")

    # -----------------------------------------------------------------------------
    # Validators & post-processing
    # -----------------------------------------------------------------------------
    @validator("ENV")
    def validate_env(cls, v: str) -> str:
        allowed = {"development", "staging", "production", "test"}
        if v not in allowed:
            raise ValueError(f"ENV must be one of {allowed}, got: {v}")
        return v

    @validator("LOG_LEVEL", always=True)
    def sync_log_level_with_debug(cls, v: str, values) -> str:
        # If DEBUG is true, force DEBUG log level unless explicitly set to a higher severity
        debug = values.get("DEBUG", False)
        if debug:
            return "DEBUG"
        return v.upper()

    @validator("DATABASE_URL", pre=True, always=True)
    def compose_database_url_if_missing(cls, v, values):
        """
        Allow users to specify individual DB parts; if DATABASE_URL isn't provided, compose it.
        """
        if v:
            return v

        user = values.get("DB_USER")
        pwd = values.get("DB_PASSWORD")
        host = values.get("DB_HOST")
        port = values.get("DB_PORT")
        name = values.get("DB_NAME")

        parts_present = all([user, pwd, host, port, name])
        if parts_present:
            return f"postgresql+psycopg2://{user}:{pwd}@{host}:{port}/{name}"

        raise ValueError(
            "DATABASE_URL is required. Alternatively provide DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME."
        )

    class Config:
        case_sensitive = True
        env_file = ENV_PATH  # Redundant due to load_dotenv, but explicit for clarity
        env_file_encoding = "utf-8"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Returns a cached Settings instance.
    Use this everywhere to avoid re-parsing .env and to keep a single configuration source.
    """
    return Settings()

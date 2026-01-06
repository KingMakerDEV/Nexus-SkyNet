

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import get_settings

# Load settings
settings = get_settings()

# ---------------------------------------------------------------------------
# SQLAlchemy Engine
# ---------------------------------------------------------------------------
# echo=settings.DB_ECHO_SQL enables SQL logging if needed
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=settings.DB_POOL_MAX_SIZE,
    max_overflow=0,
    echo=settings.DB_ECHO_SQL,
    future=True,  # use SQLAlchemy 2.0 style
)

# ---------------------------------------------------------------------------
# Session Factory
# ---------------------------------------------------------------------------
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    future=True,
)

# ---------------------------------------------------------------------------
# Base class for ORM models
# ---------------------------------------------------------------------------
Base = declarative_base()

# ---------------------------------------------------------------------------
# FastAPI Dependency
# ---------------------------------------------------------------------------
def get_db():
    """
    Dependency that provides a SQLAlchemy session.
    Ensures session is closed after request.
    Usage in FastAPI routes:
        from app.database import get_db
        def endpoint(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

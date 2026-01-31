import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
from typing import Generator

# Load environment variables from .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in .env file")

# Global engine and session factory (initialized later)
engine = None
SessionLocal = None


def init_db_pool(database_url: str = DATABASE_URL):
    """
    Initialize the SQLAlchemy engine and session factory.
    """
    global engine, SessionLocal
    engine = create_engine(database_url, pool_pre_ping=True)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return engine


def close_db_pool():
    """
    Dispose of the SQLAlchemy engine (close all connections).
    """
    global engine
    if engine:
        engine.dispose()
        engine = None


def get_db() -> Generator[Session, None, None]:
    """
    Provide a database session generator for dependency injection.
    """
    if SessionLocal is None:
        raise RuntimeError("Database pool not initialized. Call init_db_pool() first.")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

import os


class Config:
    # -------------------------------------------------
    # Core
    # -------------------------------------------------
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    DEBUG = True

    # -------------------------------------------------
    # PostgreSQL Database
    # -------------------------------------------------
    DB_USER = "postgres"
    DB_PASSWORD = "Abhay123"
    DB_HOST = "localhost"
    DB_PORT = "5432"   # default PostgreSQL port
    DB_NAME = "nexus_skynet"   # change if your DB name is different

    SQLALCHEMY_DATABASE_URI = (
        f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

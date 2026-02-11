# Backend/app/env_utils.py
import os
from dotenv import load_dotenv

# Load .env once at import
ENV_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(dotenv_path=ENV_PATH, override=False)

def getenv_values(*keys: str) -> dict:
    """
    Fetch multiple environment variables at once.
    Returns a dict {key: value or None}.
    """
    return {key: os.getenv(key) for key in keys}

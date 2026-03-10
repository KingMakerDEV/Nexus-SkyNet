import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")

ACCESS_TOKEN_EXPIRE_MINUTES = 10080
REFRESH_TOKEN_EXPIRE_DAYS = 7
VIZ_TOKEN_EXPIRE_HOURS = 24  # Visualization tokens last 24 hours


# -----------------------------
# CREATE ACCESS TOKEN
# -----------------------------
def create_access_token(payload: dict):
    payload_copy = payload.copy()
    payload_copy["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload_copy["token_type"] = "access"
    token = jwt.encode(payload_copy, SECRET_KEY, algorithm="HS256")
    return token


# -----------------------------
# CREATE REFRESH TOKEN
# -----------------------------
def create_refresh_token(payload: dict):
    payload_copy = payload.copy()
    payload_copy["exp"] = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    payload_copy["token_type"] = "refresh"
    token = jwt.encode(payload_copy, SECRET_KEY, algorithm="HS256")
    return token


# -----------------------------
# CREATE VISUALIZATION TOKEN (NEW)
# -----------------------------
def create_visualization_token(dataset_id: str, user_id: str = None):
    """
    Create a short-lived token specifically for accessing a dataset visualization.
    """
    payload = {
        "dataset_id": dataset_id,
        "user_id": user_id,
        "token_type": "visualization",
        "exp": datetime.utcnow() + timedelta(hours=VIZ_TOKEN_EXPIRE_HOURS)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token


# -----------------------------
# VERIFY TOKEN (UPDATED)
# -----------------------------
def verify_jwt_token(token):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


# -----------------------------
# VERIFY VISUALIZATION TOKEN (NEW)
# -----------------------------
def verify_visualization_token(token, expected_dataset_id=None):
    """
    Verify a visualization token and optionally check if it matches a dataset.
    """
    payload = verify_jwt_token(token)
    if not payload:
        return None
    
    # Check if it's a visualization token
    if payload.get("token_type") != "visualization":
        return None
    
    # If expected_dataset_id is provided, verify it matches
    if expected_dataset_id and payload.get("dataset_id") != expected_dataset_id:
        return None
    
    return payload

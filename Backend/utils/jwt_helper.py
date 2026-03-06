import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7


# -----------------------------
# CREATE ACCESS TOKEN
# -----------------------------
def create_access_token(payload: dict):

    payload_copy = payload.copy()

    payload_copy["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    token = jwt.encode(payload_copy, SECRET_KEY, algorithm="HS256")

    return token


# -----------------------------
# CREATE REFRESH TOKEN
# -----------------------------
def create_refresh_token(payload: dict):

    payload_copy = payload.copy()

    payload_copy["exp"] = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    token = jwt.encode(payload_copy, SECRET_KEY, algorithm="HS256")

    return token


# -----------------------------
# VERIFY TOKEN
# -----------------------------
def verify_jwt_token(token):

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded

    except jwt.ExpiredSignatureError:
        return None

    except jwt.InvalidTokenError:
        return None
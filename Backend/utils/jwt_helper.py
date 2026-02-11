import jwt
from datetime import datetime, timedelta
from app.config import Config


def create_jwt_token(user_id, remember=False):

    if remember:
        expire_time = datetime.utcnow() + timedelta(days=7)
    else:
        expire_time = datetime.utcnow() + timedelta(hours=24)

    payload = {
        "user_id": str(user_id),   # ⭐ FIX HERE
        "iat": datetime.utcnow(),
        "exp": expire_time
    }

    token = jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")

    return token


def verify_jwt_token(token):
    try:
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

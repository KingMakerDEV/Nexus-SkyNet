from flask import jsonify, request, g
from functools import wraps
from utils.jwt_helper import verify_jwt_token


def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"message": "Token missing"}), 401

        try:
            token = auth_header.split(" ")[1]
        except IndexError:
            return jsonify({"message": "Token invalid"}), 401

        payload = verify_jwt_token(token)

        if not payload:
            return jsonify({"message": "Token expired or invalid"}), 401

        # store user globally for request
        g.user_id = payload["user_id"]

        return f(*args, **kwargs)

    return wrapper

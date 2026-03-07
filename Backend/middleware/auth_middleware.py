from flask import request, jsonify, g
from functools import wraps

from utils.jwt_helper import verify_jwt_token


def jwt_required(f):
    """
    Middleware decorator to protect routes using JWT access tokens.
    """

    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({
                "status": "error",
                "message": "Authorization token missing"
            }), 401

        try:
            token = auth_header.split(" ")[1]
        except IndexError:
            return jsonify({
                "status": "error",
                "message": "Invalid authorization header format"
            }), 401

        payload = verify_jwt_token(token)

        if not payload:
            return jsonify({
                "status": "error",
                "message": "Token expired or invalid"
            }), 401

        # Attach user context to request
        g.user_id = payload.get("user_id")
        g.user_role = payload.get("role")

        return f(*args, **kwargs)

    return decorated
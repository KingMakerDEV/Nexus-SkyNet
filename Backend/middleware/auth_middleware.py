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
        g.token_type = payload.get("token_type", "access")

        return f(*args, **kwargs)

    return decorated


def optional_auth(f):
    """
    Middleware decorator that optionally authenticates the user.
    Doesn't return error if token is missing - just sets g.user_id to None.
    Useful for routes that accept both authenticated and unauthenticated requests.
    """

    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")
        
        # Default values
        g.user_id = None
        g.user_role = None
        g.token_type = None

        if auth_header and auth_header.startswith("Bearer "):
            try:
                token = auth_header.split(" ")[1]
                payload = verify_jwt_token(token)

                if payload:
                    g.user_id = payload.get("user_id")
                    g.user_role = payload.get("role")
                    g.token_type = payload.get("token_type", "access")
            except (IndexError, Exception):
                # Just ignore token errors in optional auth
                pass

        return f(*args, **kwargs)

    return decorated


def get_user_from_token(auth_header):
    """
    Helper function to extract user info from token string.
    Returns None if token is invalid or missing.
    """
    if not auth_header or not auth_header.startswith("Bearer "):
        return None

    try:
        token = auth_header.split(" ")[1]
        payload = verify_jwt_token(token)

        if not payload:
            return None

        return {
            'id': payload.get('user_id'),
            'role': payload.get('role'),
            'token_type': payload.get('token_type', 'access')
        }
    except (IndexError, Exception):
        return None

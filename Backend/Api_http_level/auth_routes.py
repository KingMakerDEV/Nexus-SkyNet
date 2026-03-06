from flask import Blueprint, request, jsonify, g
from Services.auth_service import AuthService
from middleware.auth_middleware import jwt_required
from app.extionsions import db


auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


# -----------------------------
# SIGNUP
# -----------------------------
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request body required"
        }), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "status": "error",
            "message": "name, email, password are required"
        }), 400

    try:
        service = AuthService(db)

        result = service.signup(
            name=name,
            email=email,
            password=password
        )

        return jsonify(result), 201

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# -----------------------------
# LOGIN
# -----------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request body required"
        }), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "status": "error",
            "message": "email and password required"
        }), 400

    try:
        service = AuthService(db)

        result = service.login(email=email, password=password)

        return jsonify({
            "status": "success",
            "access_token": result["access_token"],
            "refresh_token": result["refresh_token"],
            "user": result["user"]
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 401


# -----------------------------
# LOGOUT
# -----------------------------
@auth_bp.route("/logout", methods=["POST"])
@jwt_required
def logout():
    try:
        service = AuthService(db)

        service.logout(g.user_id)

        return jsonify({
            "status": "success",
            "message": "Logged out successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# -----------------------------
# CURRENT USER
# -----------------------------
@auth_bp.route("/me", methods=["GET"])
@jwt_required
def me():
    try:
        service = AuthService(db)

        user = service.get_user_by_id(g.user_id)

        return jsonify({
            "status": "success",
            "user": user
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
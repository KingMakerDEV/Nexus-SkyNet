from flask import Blueprint, request, jsonify ,g
from Services.auth_service import register_user, login_user
from sqlalchemy.sql.functions import user
from repository.user_repo import get_user_by_id
from middleware.auth_middleware import token_required

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    response, status = register_user(
        data["name"],
        data["email"],
        data["password"]
    )

    return jsonify(response), status


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    response, status = login_user(
        data["email"],
        data["password"],
        data.get("remember", False)
    )

    return jsonify(response), status


@auth_bp.route("/profile", methods=["GET"])
@token_required
def profile():
    user = get_user_by_id(g.user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "name": user.name,
        "user_id": user.id,
        "email": user.email
    }), 200


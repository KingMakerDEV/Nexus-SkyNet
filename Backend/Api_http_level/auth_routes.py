from flask import Blueprint, request, jsonify
from Services.auth_service import register_user, login_user

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
        data["password"]
    )

    return jsonify(response), status

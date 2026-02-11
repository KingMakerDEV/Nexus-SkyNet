from repository.user_repo import get_user_by_email, create_user
from werkzeug.security import generate_password_hash, check_password_hash
from utils.jwt_helper import create_jwt_token


def register_user(name, email, password):
    if get_user_by_email(email):
        return {"error": "Email already exists"}, 400

    hashed = generate_password_hash(password)
    user = create_user(name, email, hashed)

    token = create_jwt_token(user.id, remember=False)

    return {
        "message": "Registered successfully",
        "token": token,
        "user_id": user.id
    }, 201


def login_user(email, password, remember=False):
    user = get_user_by_email(email)

    if not user:
        return {"error": "User not found"}, 404

    if not check_password_hash(user.password, password):
        return {"error": "Wrong password"}, 401

    token = create_jwt_token(user.id, remember)

    return {
        "message": "Login success",
        "token": token,
        "user_id": user.id
    }, 200

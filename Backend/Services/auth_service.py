import bcrypt
from datetime import datetime

from repository.user_repo import UserRepository
from utils.jwt_helper import create_access_token, create_refresh_token


class AuthService:

    def __init__(self, db):
        self.db = db
        self.user_repo = UserRepository(db)

    # -----------------------------
    # SIGNUP
    # -----------------------------
    def signup(self, name: str, email: str, password: str):

        existing_user = self.user_repo.get_user_by_email(email)

        if existing_user:
            raise Exception("User already exists")

        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        user = self.user_repo.create_user(
            name=name,
            email=email,
            password=hashed_password
        )

        return {
            "status": "success",
            "message": "User created successfully",
            "user": {
                "id": str(user.id),
                "name": user.name,
                "email": user.email
            }
        }

    # -----------------------------
    # LOGIN
    # -----------------------------
    def login(self, email: str, password: str):

        user = self.user_repo.get_user_by_email(email)

        if not user:
            raise Exception("Invalid credentials")

        if not bcrypt.checkpw(
            password.encode("utf-8"),
            user.password.encode("utf-8")
        ):
            raise Exception("Invalid credentials")

        access_token = create_access_token({
            "user_id": str(user.id),
            "role": user.role
        })

        refresh_token = create_refresh_token({
            "user_id": str(user.id)
        })

        # store refresh token
        self.user_repo.store_refresh_token(user.id, refresh_token)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": str(user.id),
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }

    # -----------------------------
    # LOGOUT
    # -----------------------------
    def logout(self, user_id):

        self.user_repo.invalidate_refresh_token(user_id)

    # -----------------------------
    # GET USER
    # -----------------------------
    def get_user_by_id(self, user_id):

        user = self.user_repo.get_user_by_id(user_id)

        if not user:
            raise Exception("User not found")

        return {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }

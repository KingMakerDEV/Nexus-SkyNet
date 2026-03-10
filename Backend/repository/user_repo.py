from Models.users import User
from app.extionsions import db


class UserRepository:

    def __init__(self, db_instance):
        self.db = db_instance

    # -----------------------------
    # CREATE USER
    # -----------------------------
    def create_user(self, name, email, password):

        user = User(
            name=name,
            email=email,
            password=password
        )

        self.db.session.add(user)
        self.db.session.commit()

        return user

    # -----------------------------
    # GET USER BY EMAIL
    # -----------------------------
    def get_user_by_email(self, email):

        return User.query.filter_by(email=email).first()

    # -----------------------------
    # GET USER BY ID
    # -----------------------------
    def get_user_by_id(self, user_id):

        return User.query.get(user_id)

    # -----------------------------
    # STORE REFRESH TOKEN
    # -----------------------------
    def store_refresh_token(self, user_id, refresh_token):

        user = User.query.get(user_id)

        if user:
            user.refresh_token = refresh_token
            self.db.session.commit()

    # -----------------------------
    # INVALIDATE REFRESH TOKEN
    # -----------------------------
    def invalidate_refresh_token(self, user_id):

        user = User.query.get(user_id)

        if user:
            user.refresh_token = None
            self.db.session.commit()

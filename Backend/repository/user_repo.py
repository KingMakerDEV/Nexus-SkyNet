from Models.users import User
from app.extionsions import db


def get_user_by_email(email):
    return User.query.filter_by(email=email).first()


def create_user(name, email, password):
    user = User(name=name, email=email, password=password)

    db.session.add(user)
    db.session.commit()

    return user  # ✅ IMPORTANT


def get_user_by_id(id):
    return User.query.filter_by(id=id).first()
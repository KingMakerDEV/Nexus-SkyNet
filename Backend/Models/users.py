import uuid
from app.extionsions import db


class User(db.Model):
    __tablename__ = "users"

    # Primary Key
    id = db.Column(
        db.UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    # User Information
    name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(255),
        nullable=False,
        unique=True
    )

    phone = db.Column(
        db.String(20),
        nullable=True
    )

    # Authentication
    password = db.Column(
        db.String(255),
        nullable=False
    )

    # Role
    role = db.Column(
        db.String(20),
        default="user"
    )

    # Timestamp
    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    # Optional refresh token storage
    refresh_token = db.Column(
        db.Text,
        nullable=True
    )

    def __repr__(self):
        return f"<User id={self.id} email={self.email} role={self.role}>"
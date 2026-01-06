
import uuid
from sqlalchemy import Column, String, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class User(Base):
    __tablename__ = "users"

    # Columns
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(String(20), default="user")
    created_at = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP")

    def __repr__(self):
        return f"<User(id={self.id}, name={self.name}, email={self.email})>"

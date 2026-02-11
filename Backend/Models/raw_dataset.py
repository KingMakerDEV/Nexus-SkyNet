

import uuid
from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class RawDataset(Base):
    __tablename__ = "raw_datasets"

    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign keys
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    source_id = Column(Integer, ForeignKey("data_sources.id"))

    # Raw payload from API or upload
    raw_payload = Column(JSON, nullable=False)

    # Format of the payload (JSON or CSV)
    format = Column(String(20), nullable=False)

    # Processing status
    is_processed = Column(Boolean, default=False)

    # Timestamp of ingestion
    ingested_at = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP")

    def __repr__(self):
        return f"<RawDataset(id={self.id}, format={self.format}, is_processed={self.is_processed})>"

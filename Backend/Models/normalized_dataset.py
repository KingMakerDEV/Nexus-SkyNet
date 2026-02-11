

import uuid
from sqlalchemy import Column, String, TIMESTAMP, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class NormalizedDataset(Base):
    __tablename__ = "normalized_datasets"

    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Link back to raw dataset
    raw_dataset_id = Column(UUID(as_uuid=True), ForeignKey("raw_datasets.id"))

    # Standardized payload
    standardized_payload = Column(JSON, nullable=False)

    # Version of normalization pipeline
    normalization_version = Column(String(20))

    # Timestamp of normalization
    normalized_at = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP")

    def __repr__(self):
        return f"<NormalizedDataset(id={self.id}, raw_dataset_id={self.raw_dataset_id}, version={self.normalization_version})>"

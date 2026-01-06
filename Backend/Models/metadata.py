
import uuid
from sqlalchemy import Column, String, TIMESTAMP, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class DatasetMetadata(Base):
    __tablename__ = "dataset_metadata"

    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Link back to raw dataset
    raw_dataset_id = Column(UUID(as_uuid=True), ForeignKey("raw_datasets.id"))

    # Metadata fields
    dataset_name = Column(String(255))
    coordinate_system = Column(String(50))
    unit_system = Column(String(50))
    observation_time = Column(TIMESTAMP)
    tags = Column(ARRAY(String))

    # Timestamp
    created_at = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP")

    def __repr__(self):
        return f"<DatasetMetadata(id={self.id}, dataset_name={self.dataset_name}, coordinate_system={self.coordinate_system})>"

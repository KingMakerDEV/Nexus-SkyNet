from datetime import datetime
import uuid
from app.extionsions import db


class Metadata(db.Model):
    __tablename__ = "dataset_metadata"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    raw_dataset_id = db.Column(db.Integer, db.ForeignKey("raw_datasets.id"), nullable=True)
    normalized_dataset_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey("normalized_datasets.id"), nullable=True)
    meta_data = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Optional: model-level check constraint (already enforced in DB)
    __table_args__ = (
        db.CheckConstraint(
            "(raw_dataset_id IS NOT NULL AND normalized_dataset_id IS NULL) OR "
            "(raw_dataset_id IS NULL AND normalized_dataset_id IS NOT NULL)",
            name="one_dataset_reference"
        ),
    )
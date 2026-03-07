import uuid
from app.extionsions import db


class NormalizedDataset(db.Model):
    __tablename__ = "normalized_datasets"

    id = db.Column(
        db.UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    # ✅ Changed from UUID to Integer to match raw_datasets.id
    raw_dataset_id = db.Column(
        db.Integer,
        db.ForeignKey("raw_datasets.id"),
        nullable=False
    )

    standardized_payload = db.Column(
        db.JSON,
        nullable=False
    )

    normalization_version = db.Column(
        db.String(20),
        nullable=True
    )

    normalized_at = db.Column(
        db.TIMESTAMP,
        server_default=db.func.now()
    )

    def __repr__(self):
        return (
            f"<NormalizedDataset(id={self.id}, "
            f"raw_dataset_id={self.raw_dataset_id}, "
            f"version={self.normalization_version})>"
        )
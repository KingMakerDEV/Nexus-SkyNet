from datetime import datetime
from app.extionsions import db


class Metadata(db.Model):
    __tablename__ = "dataset_metadata"

    id = db.Column(db.Integer, primary_key=True)

    dataset_id = db.Column(
        db.Integer,
        db.ForeignKey("raw_datasets.id"),
        nullable=False
    )

    meta_data = db.Column(db.JSON)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
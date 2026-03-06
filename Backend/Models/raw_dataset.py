from datetime import datetime
from app.extionsions import db


class RawDataset(db.Model):
    __tablename__ = "raw_datasets"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.String(100), nullable=False)

    source_id = db.Column(db.Integer, nullable=False)

    data = db.Column(db.JSON, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    updated_at = db.Column(db.DateTime, nullable=True)
from typing import List, Optional
from app.extionsions import db
from Models.metadata import Metadata


class MetadataRepository:
    def __init__(self):
        self.db = db

    def create(self, metadata: Metadata) -> Metadata:
        self.db.session.add(metadata)
        self.db.session.commit()
        self.db.session.refresh(metadata)
        return metadata

    def get_by_id(self, metadata_id: str) -> Optional[Metadata]:
        return self.db.session.query(Metadata).filter(Metadata.id == metadata_id).first()

    def get_all(self) -> List[Metadata]:
        return self.db.session.query(Metadata).all()

    def get_by_raw_dataset(self, raw_dataset_id: int) -> List[Metadata]:
        return self.db.session.query(Metadata).filter(
            Metadata.raw_dataset_id == raw_dataset_id
        ).all()

    def get_by_normalized_dataset(self, normalized_dataset_id: str) -> List[Metadata]:
        return self.db.session.query(Metadata).filter(
            Metadata.normalized_dataset_id == normalized_dataset_id
        ).all()
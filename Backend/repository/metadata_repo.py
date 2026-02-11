

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.metadata import DatasetMetadata


class MetadataRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, metadata: DatasetMetadata) -> DatasetMetadata:
        self.db.add(metadata)
        self.db.commit()
        self.db.refresh(metadata)
        return metadata

    def get_by_id(self, metadata_id: str) -> Optional[DatasetMetadata]:
        return self.db.query(DatasetMetadata).filter(DatasetMetadata.id == metadata_id).first()

    def get_all(self) -> List[DatasetMetadata]:
        return self.db.query(DatasetMetadata).all()

    def get_by_raw_dataset(self, raw_dataset_id: str) -> List[DatasetMetadata]:
        return self.db.query(DatasetMetadata).filter(
            DatasetMetadata.raw_dataset_id == raw_dataset_id
        ).all()

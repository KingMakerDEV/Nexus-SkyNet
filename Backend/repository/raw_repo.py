

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.raw_dataset import RawDataset


class RawRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, raw_dataset: RawDataset) -> RawDataset:
        self.db.add(raw_dataset)
        self.db.commit()
        self.db.refresh(raw_dataset)
        return raw_dataset

    def get_by_id(self, dataset_id: str) -> Optional[RawDataset]:
        return self.db.query(RawDataset).filter(RawDataset.id == dataset_id).first()

    def get_all(self) -> List[RawDataset]:
        return self.db.query(RawDataset).all()

    def mark_processed(self, dataset_id: str) -> Optional[RawDataset]:
        dataset = self.get_by_id(dataset_id)
        if dataset:
            dataset.is_processed = True
            self.db.commit()
            self.db.refresh(dataset)
        return dataset

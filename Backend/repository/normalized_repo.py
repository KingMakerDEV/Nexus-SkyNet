

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.normalized_dataset import NormalizedDataset


class NormalizedRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, normalized_dataset: NormalizedDataset) -> NormalizedDataset:
        self.db.add(normalized_dataset)
        self.db.commit()
        self.db.refresh(normalized_dataset)
        return normalized_dataset

    def get_by_id(self, dataset_id: str) -> Optional[NormalizedDataset]:
        return self.db.query(NormalizedDataset).filter(NormalizedDataset.id == dataset_id).first()

    def get_all(self) -> List[NormalizedDataset]:
        return self.db.query(NormalizedDataset).all()

    def get_by_raw_dataset(self, raw_dataset_id: str) -> List[NormalizedDataset]:
        return self.db.query(NormalizedDataset).filter(
            NormalizedDataset.raw_dataset_id == raw_dataset_id
        ).all()

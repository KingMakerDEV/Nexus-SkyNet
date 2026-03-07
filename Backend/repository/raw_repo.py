from datetime import datetime
from typing import Any, Dict, List, Optional

from Models.raw_dataset import RawDataset
from Models.metadata import Metadata


class RawDatasetRepository:
    """
    Data access layer for Raw Datasets.
    """

    def __init__(self, db):
        self.db = db

    # -------------------------------------------------------
    # CREATE
    # -------------------------------------------------------

    def save_raw_dataset(
        self,
        user_id: str,
        source_id: int,
        data: List[Dict[str, Any]],
        metadata: Optional[Dict[str, Any]] = None,
    ) -> int:
        """
        Insert raw dataset into database.
        """
        raw_dataset = RawDataset(
            user_id=user_id,
            source_id=source_id,
            data=data,
            created_at=datetime.utcnow(),
        )

        self.db.session.add(raw_dataset)
        self.db.session.commit()

        dataset_id = raw_dataset.id

        # Save metadata if provided
        if metadata:
            meta = Metadata(
                raw_dataset_id=dataset_id,          # ✅ changed from dataset_id
                meta_data=metadata,
                created_at=datetime.utcnow(),
            )
            self.db.session.add(meta)
            self.db.session.commit()

        return dataset_id

    def insert_raw_dataset(
        self,
        data: List[Dict[str, Any]],
        filename: str,
        file_type: str,
        user_id: str,
        source_id: int,
    ) -> int:
        """
        Insert a raw dataset, storing filename and file type as metadata.
        """
        metadata = {"filename": filename, "file_type": file_type}
        return self.save_raw_dataset(
            user_id=user_id,
            source_id=source_id,
            data=data,
            metadata=metadata,
        )

    # -------------------------------------------------------
    # READ (Single Dataset)
    # -------------------------------------------------------

    def get_raw_dataset(self, dataset_id: int) -> Optional[RawDataset]:
        return (
            self.db.session.query(RawDataset)
            .filter(RawDataset.id == dataset_id)
            .first()
        )

    # -------------------------------------------------------
    # READ (Datasets by User)
    # -------------------------------------------------------

    def get_user_datasets(self, user_id: str) -> List[RawDataset]:
        return (
            self.db.session.query(RawDataset)
            .filter(RawDataset.user_id == user_id)
            .order_by(RawDataset.created_at.desc())
            .all()
        )

    # -------------------------------------------------------
    # UPDATE
    # -------------------------------------------------------

    def update_raw_dataset(
        self,
        dataset_id: int,
        updated_data: List[Dict[str, Any]],
    ) -> bool:
        dataset = (
            self.db.session.query(RawDataset)
            .filter(RawDataset.id == dataset_id)
            .first()
        )

        if not dataset:
            return False

        dataset.data = updated_data
        dataset.updated_at = datetime.utcnow()
        self.db.session.commit()
        return True

    # -------------------------------------------------------
    # DELETE
    # -------------------------------------------------------

    def delete_raw_dataset(self, dataset_id: int) -> bool:
        dataset = (
            self.db.session.query(RawDataset)
            .filter(RawDataset.id == dataset_id)
            .first()
        )

        if not dataset:
            return False

        self.db.session.delete(dataset)
        self.db.session.commit()
        return True
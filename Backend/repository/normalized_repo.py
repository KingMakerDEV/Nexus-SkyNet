# from datetime import datetime
# from typing import Any, Dict, List, Optional

# from app.extionsions import db
# from Models.normalized_dataset import NormalizedDataset
# from Models.metadata import Metadata


# class NormalizedDatasetRepository:
#     """
#     Data access layer for normalized datasets.

#     Responsibilities:
#     - Insert normalized datasets
#     - Fetch normalized datasets
#     - Update normalized datasets
#     - Delete normalized datasets
#     - Attach normalization metadata
#     """

#     def __init__(self, db_session=None):
#         # allow dependency injection or fallback to global db session
#         self.db = db_session if db_session else db

#     # -------------------------------------------------------
#     # CREATE
#     # -------------------------------------------------------

#     def save_normalized_dataset(
#         self,
#         raw_dataset_id: int,
#         data: List[Dict[str, Any]],
#     ) -> int:
#         """
#         Insert normalized dataset into database.
#         """

#         dataset = NormalizedDataset(
#             raw_dataset_id=raw_dataset_id,
#             data=data,
#             created_at=datetime.utcnow(),
#         )

#         self.db.session.add(dataset)
#         self.db.session.commit()

#         return dataset.id

#     # -------------------------------------------------------
#     # READ (Single Dataset)
#     # -------------------------------------------------------

#     def get_normalized_dataset(self, dataset_id: int) -> Optional[NormalizedDataset]:

#         return (
#             self.db.session.query(NormalizedDataset)
#             .filter(NormalizedDataset.id == dataset_id)
#             .first()
#         )

#     # -------------------------------------------------------
#     # READ (Datasets by Raw Dataset)
#     # -------------------------------------------------------

#     def get_by_raw_dataset(self, raw_dataset_id: int) -> List[NormalizedDataset]:

#         return (
#             self.db.session.query(NormalizedDataset)
#             .filter(NormalizedDataset.raw_dataset_id == raw_dataset_id)
#             .order_by(NormalizedDataset.created_at.desc())
#             .all()
#         )

#     # -------------------------------------------------------
#     # UPDATE
#     # -------------------------------------------------------

#     def update_normalized_dataset(
#         self,
#         dataset_id: int,
#         updated_data: List[Dict[str, Any]],
#     ) -> bool:

#         dataset = (
#             self.db.session.query(NormalizedDataset)
#             .filter(NormalizedDataset.id == dataset_id)
#             .first()
#         )

#         if not dataset:
#             return False

#         dataset.data = updated_data
#         dataset.updated_at = datetime.utcnow()

#         self.db.session.commit()

#         return True

#     # -------------------------------------------------------
#     # DELETE
#     # -------------------------------------------------------

#     def delete_normalized_dataset(self, dataset_id: int) -> bool:

#         dataset = (
#             self.db.session.query(NormalizedDataset)
#             .filter(NormalizedDataset.id == dataset_id)
#             .first()
#         )

#         if not dataset:
#             return False

#         self.db.session.delete(dataset)
#         self.db.session.commit()

#         return True

#     # -------------------------------------------------------
#     # METADATA
#     # -------------------------------------------------------

#     def add_normalization_metadata(
#         self,
#         dataset_id: int,
#         metadata: Dict[str, Any],
#     ) -> None:

#         meta = Metadata(
#             dataset_id=dataset_id,
#             meta_data=metadata,
#             created_at=datetime.utcnow(),
#         )

#         self.db.session.add(meta)
#         self.db.session.commit()


from datetime import datetime
from typing import Any, Dict, List, Optional

from app.extionsions import db
from Models.normalized_dataset import NormalizedDataset
from Models.metadata import Metadata


class NormalizedDatasetRepository:
    """
    Data access layer for normalized datasets.
    """

    def __init__(self, db_session=None):
        self.db = db_session if db_session else db

    # -------------------------------------------------------
    # CREATE
    # -------------------------------------------------------

    def save_normalized_dataset(
        self,
        raw_dataset_id: int,
        data: List[Dict[str, Any]],
        normalization_version: Optional[str] = None,
    ) -> str:   # returns UUID as string
        """
        Insert normalized dataset into database.
        """
        dataset = NormalizedDataset(
            raw_dataset_id=raw_dataset_id,
            standardized_payload=data,          # ✅ use standardized_payload column
            normalization_version=normalization_version,
            normalized_at=datetime.utcnow(),
        )

        self.db.session.add(dataset)
        self.db.session.commit()

        return str(dataset.id)                  # ✅ return string UUID

    # -------------------------------------------------------
    # READ (Single Dataset)
    # -------------------------------------------------------

    def get_normalized_dataset(self, dataset_id: str) -> Optional[NormalizedDataset]:
        return (
            self.db.session.query(NormalizedDataset)
            .filter(NormalizedDataset.id == dataset_id)
            .first()
        )

    # -------------------------------------------------------
    # READ (Datasets by Raw Dataset)
    # -------------------------------------------------------

    def get_by_raw_dataset(self, raw_dataset_id: int) -> List[NormalizedDataset]:
        return (
            self.db.session.query(NormalizedDataset)
            .filter(NormalizedDataset.raw_dataset_id == raw_dataset_id)
            .order_by(NormalizedDataset.normalized_at.desc())
            .all()
        )

    # -------------------------------------------------------
    # UPDATE
    # -------------------------------------------------------

    def update_normalized_dataset(
        self,
        dataset_id: str,
        updated_data: List[Dict[str, Any]],
    ) -> bool:
        dataset = (
            self.db.session.query(NormalizedDataset)
            .filter(NormalizedDataset.id == dataset_id)
            .first()
        )

        if not dataset:
            return False

        dataset.standardized_payload = updated_data   # ✅ correct column
        # No updated_at column – use normalized_at or add one if needed

        self.db.session.commit()
        return True

    # -------------------------------------------------------
    # DELETE
    # -------------------------------------------------------

    def delete_normalized_dataset(self, dataset_id: str) -> bool:
        dataset = (
            self.db.session.query(NormalizedDataset)
            .filter(NormalizedDataset.id == dataset_id)
            .first()
        )

        if not dataset:
            return False

        self.db.session.delete(dataset)
        self.db.session.commit()
        return True

    # -------------------------------------------------------
    # METADATA
    # -------------------------------------------------------

    def add_normalization_metadata(
        self,
        dataset_id: str,               # dataset_id is UUID string
        metadata: Dict[str, Any],
    ) -> None:
        meta = Metadata(
            dataset_id=dataset_id,      # ✅ this expects the dataset ID (UUID)
            meta_data=metadata,
            created_at=datetime.utcnow(),
        )
        self.db.session.add(meta)
        self.db.session.commit()
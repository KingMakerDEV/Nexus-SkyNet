
import uuid
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from Backend.repository.raw_repo import RawRepository
from Backend.repository.normalized_repo import NormalizedRepository
from Backend.repository.metadata_repo import MetadataRepository
from Backend.Models.raw_dataset import RawDataset
from Backend.Models.normalized_dataset import NormalizedDataset
from Backend.Models.metadata import DatasetMetadata
from Backend.Normalization_Engine.normalization_pipeline import NormalizationPipeline


class NormalizationService:
    def __init__(self, db: Session):
        self.db = db
        self.raw_repo = RawRepository(db)
        self.normalized_repo = NormalizedRepository(db)
        self.metadata_repo = MetadataRepository(db)
        self.pipeline = NormalizationPipeline(db)

    def normalize_dataset(self, raw_dataset_id: uuid.UUID) -> Dict[str, Any]:
        """
        Normalize a single raw dataset by ID.
        Flow:
        - Fetch raw dataset
        - Run normalization pipeline
        - Attach metadata
        - Persist normalized output
        - Mark raw dataset as processed
        """
        raw_dataset: RawDataset = self.raw_repo.get_by_id(raw_dataset_id)
        if not raw_dataset or raw_dataset.is_processed:
            return {"status": "skipped", "reason": "Dataset not found or already processed"}

        # Step 1: Run normalization pipeline
        normalized: NormalizedDataset = self.pipeline.normalize_dataset(raw_dataset)

        # Step 2: Attach metadata
        metadata = DatasetMetadata(
            raw_dataset_id=raw_dataset.id,
            normalized_dataset_id=normalized.id,
            metadata_payload={
                "normalization_version": normalized.normalization_version,
                "source_id": raw_dataset.source_id,
                "format": raw_dataset.format,
            },
        )
        self.metadata_repo.create(metadata)

        # Step 3: Mark raw dataset as processed
        self.raw_repo.mark_processed(raw_dataset.id)

        return {"status": "success", "normalized_dataset_id": str(normalized.id)}

    def normalize_all_pending(self) -> List[Dict[str, Any]]:
        """
        Normalize all unprocessed raw datasets.
        Flow:
        - Fetch unprocessed raw datasets
        - Run normalization pipeline for each
        - Attach metadata
        - Persist normalized output
        - Mark raw dataset as processed
        """
        results: List[Dict[str, Any]] = []
        unprocessed: List[RawDataset] = [
            ds for ds in self.raw_repo.get_all() if not ds.is_processed
        ]

        for raw_dataset in unprocessed:
            result = self.normalize_dataset(raw_dataset.id)
            results.append(result)

        return results


# Utility function for ingestion_service to trigger normalization
def trigger_normalization(db: Session, raw_dataset: RawDataset) -> None:
    """
    Trigger normalization for a single raw dataset.
    """
    service = NormalizationService(db)
    service.normalize_dataset(raw_dataset.id)

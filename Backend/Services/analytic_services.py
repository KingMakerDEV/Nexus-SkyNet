

import uuid
from typing import Dict, Any
from sqlalchemy.orm import Session

from Backend.repository.normalized_repo import NormalizedRepository
from Backend.repository.metadata_repo import MetadataRepository
from Backend.Analytics.comparision_engine import ComparisonEngine
from Backend.Analytics.statistics import Statistics
from Backend.Analytics.aggrigation import Aggregation


class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db
        self.normalized_repo = NormalizedRepository(db)
        self.metadata_repo = MetadataRepository(db)

    def compare_datasets(self, id_a: uuid.UUID, id_b: uuid.UUID) -> Dict[str, Any]:
        """
        Compare two normalized datasets by ID.
        Flow:
        - Fetch datasets
        - Run comparison engine
        - Store comparison results (metadata)
        - Return structured JSON
        """
        ds_a = self.normalized_repo.get_by_id(id_a)
        ds_b = self.normalized_repo.get_by_id(id_b)

        if not ds_a or not ds_b:
            return {"status": "error", "reason": "Dataset(s) not found"}

        # Run comparison
        comparison_result = ComparisonEngine.compare_datasets(
            ds_a.standardized_payload, ds_b.standardized_payload
        )
        similarity_score = ComparisonEngine.compute_similarity_score(
            ds_a.standardized_payload, ds_b.standardized_payload
        )

        # Store comparison result in metadata
        metadata_payload = {
            "comparison_result": comparison_result,
            "similarity_score": similarity_score,
        }
        self.metadata_repo.create(
            metadata=self.metadata_repo.model(
                raw_dataset_id=None,
                normalized_dataset_id=ds_a.id,
                metadata_payload=metadata_payload,
            )
        )

        return {
            "status": "success",
            "comparison": comparison_result,
            "similarity_score": similarity_score,
        }

    def get_dataset_summary(self, dataset_id: uuid.UUID) -> Dict[str, Any]:
        """
        Produce a structured summary of a single normalized dataset.
        Flow:
        - Fetch dataset
        - Run statistics + aggregation
        - Return structured JSON (AI-friendly)
        """
        ds = self.normalized_repo.get_by_id(dataset_id)
        if not ds:
            return {"status": "error", "reason": "Dataset not found"}

        payload = ds.standardized_payload

        # Extract numeric fields for statistics
        numeric_values = [
            v for v in payload.values() if isinstance(v, (int, float))
        ]
        stats_summary = Statistics.summary(numeric_values)

        # Aggregation example: group by object_type or region if present
        aggregation_summary = {}
        if "object_type" in payload:
            aggregation_summary = Aggregation.aggregate_by_object_type([payload])
        elif "coordinate_system" in payload:
            aggregation_summary = Aggregation.aggregate_by_region([payload])

        return {
            "status": "success",
            "dataset_id": str(dataset_id),
            "statistics": stats_summary,
            "aggregation": aggregation_summary,
        }

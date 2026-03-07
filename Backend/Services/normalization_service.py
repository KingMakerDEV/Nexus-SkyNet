from datetime import datetime
from typing import Dict, Any

from Normalization_Engine.normalization_pipeline import NormalizationPipeline
from repository.normalized_repo import NormalizedDatasetRepository


class NormalizationService:
    """
    Business logic layer for dataset normalization.
    """

    def __init__(self, db):
        self.db = db
        self.pipeline = NormalizationPipeline(db)
        self.normalized_repo = NormalizedDatasetRepository(db)

    # -------------------------------------------------------
    # METHOD EXPECTED BY INGESTION SERVICE
    # -------------------------------------------------------
    def normalize(self, dataset_id: int) -> str:
        """
        Run normalization and return the normalized dataset ID.
        Raises an exception on failure.
        """
        result = self.pipeline.run(dataset_id)

        if result.get("status") != "success":
            raise Exception(result.get("error", "Normalization failed"))

        normalized_id = result["normalized_dataset_id"]

        # Attach metadata (normalized_by, timestamp)
        self.normalized_repo.add_normalization_metadata(
            dataset_id=normalized_id,
            metadata={
                "normalized_by": "system",
                "normalized_at": datetime.utcnow().isoformat(),
            },
        )

        return normalized_id

    # -------------------------------------------------------
    # ORIGINAL METHOD (optional, can be kept)
    # -------------------------------------------------------
    def run_pipeline(self, dataset_id: int, normalized_by: str = "system") -> Dict[str, Any]:
        """
        Original method – returns a dict with status and id.
        """
        try:
            normalized_id = self.normalize(dataset_id)
            return {
                "status": "success",
                "normalized_dataset_id": normalized_id,
                "records": self._get_record_count(dataset_id),  # you may need to implement this
                "message": "Dataset normalized successfully",
            }
        except Exception as e:
            return {"status": "error", "error": str(e)}

    def _get_record_count(self, dataset_id: int) -> int:
        """Helper to get record count – optional."""
        # You can fetch the raw dataset and count its records
        # For now, return 0 or implement as needed
        return 0
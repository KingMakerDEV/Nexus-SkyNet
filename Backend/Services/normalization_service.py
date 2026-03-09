from datetime import datetime
from typing import Dict, Any, Optional

from Normalization_Engine.normalization_pipeline import NormalizationPipeline
from repository.normalized_repo import NormalizedDatasetRepository
from utils.jwt_helper import create_visualization_token


class NormalizationService:
    """
    Business logic layer for dataset normalization.
    """

    def __init__(self, db):
        self.db = db
        self.pipeline = NormalizationPipeline(db)
        self.normalized_repo = NormalizedDatasetRepository(db)

    # -------------------------------------------------------
    # UPDATED METHOD – returns dict with token
    # -------------------------------------------------------
    def normalize(self, dataset_id: int, user_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Run normalization and return a dict containing:
        - status: "success" or "error"
        - normalized_dataset_id: UUID of the normalized dataset
        - visualization_token: JWT token for accessing visualization
        - records: number of records processed
        """
        result = self.pipeline.run(dataset_id)

        if result.get("status") != "success":
            raise Exception(result.get("error", "Normalization failed"))

        normalized_id = result["normalized_dataset_id"]
        records = result.get("records", 0)

        # Attach metadata (normalized_by, timestamp) – requires raw_dataset_id
        self.normalized_repo.add_normalization_metadata(
            dataset_id=normalized_id,
            raw_dataset_id=dataset_id,  # Pass the raw dataset ID
            metadata={
                "normalized_by": "system",
                "normalized_at": datetime.utcnow().isoformat(),
            },
        )

        # Generate visualization token for this dataset
        viz_token = create_visualization_token(normalized_id, user_id)

        return {
            "status": "success",
            "normalized_dataset_id": normalized_id,
            "visualization_token": viz_token,
            "records": records
        }

    # -------------------------------------------------------
    # UPDATED ORIGINAL METHOD (kept for compatibility)
    # -------------------------------------------------------
    def run_pipeline(self, dataset_id: int, user_id: Optional[str] = None, normalized_by: str = "system") -> Dict[str, Any]:
        """
        Returns a dict with status, id, token, records, and message.
        """
        try:
            result = self.normalize(dataset_id, user_id)
            result["message"] = "Dataset normalized successfully"
            return result
        except Exception as e:
            return {"status": "error", "error": str(e)}

    def _get_record_count(self, dataset_id: int) -> int:
        """Helper to get record count – optional."""
        # You can implement this by fetching the raw dataset and counting rows
        return 0
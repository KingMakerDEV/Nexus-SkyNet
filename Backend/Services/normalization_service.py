from datetime import datetime
from typing import Dict, Any

from Normalization_Engine.normalization_pipeline import NormalizationPipeline
from repository.normalized_repo import NormalizedDatasetRepository


class NormalizationService:
    """
    Business logic layer for dataset normalization.

    Responsibilities:
    - Receive normalization requests from routes/services
    - Execute normalization pipeline
    - Attach metadata (who normalized, timestamp)
    - Persist normalized dataset
    """

    def __init__(self, db):
        self.db = db
        self.pipeline = NormalizationPipeline(db)
        self.normalized_repo = NormalizedDatasetRepository(db)

    # -------------------------------------------------------
    # RUN NORMALIZATION
    # -------------------------------------------------------

    def run_pipeline(self, dataset_id: int, normalized_by: str = "system") -> Dict[str, Any]:
        """
        Run normalization pipeline for a raw dataset.
        """

        try:
            result = self.pipeline.run(dataset_id)

            if result.get("status") != "success":
                return result

            normalized_dataset_id = result.get("normalized_dataset_id")

            # attach normalization metadata
            self.normalized_repo.add_normalization_metadata(
                dataset_id=normalized_dataset_id,
                metadata={
                    "normalized_by": normalized_by,
                    "normalized_at": datetime.utcnow().isoformat(),
                },
            )

            return {
                "status": "success",
                "normalized_dataset_id": normalized_dataset_id,
                "records": result.get("records", 0),
                "message": "Dataset normalized successfully",
            }

        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
            }
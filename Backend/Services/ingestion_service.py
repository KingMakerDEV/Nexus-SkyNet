from Ingestion.validators import validate_dataset_schema, DatasetValidationError
from Ingestion.api_ingester import APIIngestor
from repository.raw_repo import RawDatasetRepository
from Services.normalization_service import NormalizationService


class IngestionService:
    """
    Business logic layer for ingestion.

    Responsibilities:
    - Handle user file uploads
    - Handle external API ingestion
    - Validate datasets
    - Store raw datasets
    - Trigger normalization pipeline
    """

    def __init__(self, db):
        self.db = db
        self.raw_repo = RawDatasetRepository(db)
        self.api_ingestor = APIIngestor(db)
        self.normalization_service = NormalizationService(db)

    # -------------------------------------------------
    # USER FILE UPLOAD
    # -------------------------------------------------

    def ingest_user_upload(self, file_content, file_type, filename, user_id, source_id):

        try:
            # Validate dataset structure
            parsed_rows = validate_dataset_schema(file_content, file_type)

            # Store dataset using repository
            dataset_id = self.raw_repo.insert_raw_dataset(
                data=parsed_rows,
                filename=filename,
                file_type=file_type,
                user_id=user_id,
                source_id=source_id
            )

            return {
                "status": "success",
                "dataset_id": dataset_id,
                "records": len(parsed_rows)
            }

        except DatasetValidationError as e:
            return {
                "status": "error",
                "error": str(e)
            }

        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }

    # -------------------------------------------------
    # INGEST FROM EXTERNAL API
    # -------------------------------------------------

    def ingest_from_api(self, source_id, query, user_id):

        try:
            result = self.api_ingestor.ingest_from_api(
                source_id=source_id,
                query=query,
                user_id=user_id
            )

            return result

        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }

    # -------------------------------------------------
    # NORMALIZE DATASET
    # -------------------------------------------------

    def normalize_dataset(self, dataset_id):

        try:
            normalized_dataset_id = self.normalization_service.normalize(dataset_id)

            return {
                "status": "success",
                "normalized_dataset_id": normalized_dataset_id
            }

        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }
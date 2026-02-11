

import uuid
from typing import Dict, Any
from sqlalchemy.orm import Session

from Backend.Ingestion.api_ingester import APIIngestor
from Backend.Ingestion.user_uploads import UserUploads
from Backend.Ingestion.validators import Validators
from Backend.repository.raw_repo import RawRepository
from Backend.Models.raw_dataset import RawDataset
from Backend.Services import normalization_service


class IngestionService:
    def __init__(self, db: Session):
        self.db = db
        self.raw_repo = RawRepository(db)
        self.api_ingester = APIIngestor()
        self.upload_handler = UserUploads()

    def ingest_from_api(self, source_id: int, query: str, user_id: uuid.UUID) -> Dict[str, Any]:
        """
        Ingest data from an external API (e.g., NASA).
        Flow:
        - Fetch data via APIIngestor
        - Validate payload
        - Persist raw dataset
        - Trigger normalization (delegated)
        """
        # Step 1: Fetch raw payload
        payload = self.api_ingester.search_nasa_images(query)

        # Step 2: Validate
        Validators.validate_raw_payload(payload)
        Validators.validate_format("JSON")

        # Step 3: Persist raw dataset
        raw_dataset = RawDataset(
            user_id=user_id,
            source_id=source_id,
            raw_payload=payload,
            format="JSON",
            is_processed=False,
        )
        saved = self.raw_repo.create(raw_dataset)

        # Step 4: Trigger normalization (delegated)
        normalization_service.trigger_normalization(self.db, saved)

        return {"status": "success", "raw_dataset_id": str(saved.id)}

    def ingest_user_upload(self, file_content: str, file_type: str, user_id: uuid.UUID, source_id: int) -> Dict[str, Any]:
        """
        Ingest data from user-uploaded file (CSV or JSON).
        Flow:
        - Parse file via UserUploads
        - Validate payload
        - Persist raw dataset
        - Trigger normalization (delegated)
        """
        # Step 1: Parse file
        if file_type.upper() == "JSON":
            payload = self.upload_handler.parse_json(file_content)
        elif file_type.upper() == "CSV":
            payload = self.upload_handler.parse_csv(file_content)
        else:
            raise ValueError("Unsupported file type")

        # Step 2: Validate
        Validators.validate_format(file_type.upper())
        if isinstance(payload, dict):
            Validators.validate_raw_payload(payload)

        # Step 3: Persist raw dataset
        raw_dataset = RawDataset(
            user_id=user_id,
            source_id=source_id,
            raw_payload=payload,
            format=file_type.upper(),
            is_processed=False,
        )
        saved = self.raw_repo.create(raw_dataset)

        # Step 4: Trigger normalization (delegated)
        normalization_service.trigger_normalization(self.db, saved)

        return {"status": "success", "raw_dataset_id": str(saved.id)}

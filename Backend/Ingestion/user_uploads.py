import csv
import json
import io
from typing import Dict, Any, List, Union
from datetime import datetime

from repository.raw_repo import RawDatasetRepository
from Ingestion.validators import validate_dataset_schema

class UserUploadIngestor:
    """
    Handles ingestion of user-uploaded files (CSV / JSON).

    Responsibilities:
    - Detect file type
    - Parse file into structured Python object
    - Validate schema
    - Persist raw dataset + metadata
    """

    def __init__(self, db):
        self.db = db
        self.raw_repo = RawDatasetRepository(db)

    # -------------------------------------------------------
    # Main entry point
    # -------------------------------------------------------

    def ingest_upload(
        self,
        file_content: str,
        filename: str,
        user_id: str,
        source_id: int,
    ) -> Dict[str, Any]:

        file_type = self._detect_file_type(filename)

        if file_type == "CSV":
            parsed_data = self._parse_csv(file_content)

        elif file_type == "JSON":
            parsed_data = self._parse_json(file_content)

        else:
            raise ValueError("Unsupported file type")

        validate_dataset_schema(parsed_data)

        dataset_id = self.raw_repo.save_raw_dataset(
            user_id=user_id,
            source_id=source_id,
            data=parsed_data,
            metadata={
                "filename": filename,
                "file_type": file_type,
                "uploaded_at": datetime.utcnow().isoformat(),
            },
        )

        return {
            "status": "success",
            "dataset_id": dataset_id,
            "records": len(parsed_data),
        }

    # -------------------------------------------------------
    # File type detection
    # -------------------------------------------------------

    def _detect_file_type(self, filename: str) -> str:

        filename = filename.lower()

        if filename.endswith(".csv"):
            return "CSV"

        if filename.endswith(".json"):
            return "JSON"

        raise ValueError("File must be CSV or JSON")

    # -------------------------------------------------------
    # CSV Parsing
    # -------------------------------------------------------

    def _parse_csv(self, content: str) -> List[Dict[str, Any]]:

        reader = csv.DictReader(io.StringIO(content))

        rows = []

        for row in reader:

            cleaned_row = {}

            for key, value in row.items():

                if key is None:
                    continue

                clean_key = key.strip().lower().replace(" ", "_")

                if value is None or value == "":
                    continue

                cleaned_row[clean_key] = value.strip()

            if cleaned_row:
                rows.append(cleaned_row)

        return rows

    # -------------------------------------------------------
    # JSON Parsing
    # -------------------------------------------------------

    def _parse_json(self, content: str) -> Union[List[Dict[str, Any]], Dict[str, Any]]:

        data = json.loads(content)

        if isinstance(data, dict):

            if "data" in data:
                data = data["data"]

            else:
                data = [data]

        if not isinstance(data, list):
            raise ValueError("JSON must contain an object or list of objects")

        cleaned_rows = []

        for item in data:

            if not isinstance(item, dict):
                continue

            cleaned = {}

            for key, value in item.items():

                clean_key = key.strip().lower().replace(" ", "_")

                if value is None or value == "":
                    continue

                cleaned[clean_key] = value

            if cleaned:
                cleaned_rows.append(cleaned)

        return cleaned_rows
import requests
import csv
import io
from typing import Dict, Any, List

from repository.raw_repo import RawDatasetRepository
from Ingestion.validators import validate_dataset_schema

class APIIngestor:
    """
    Handles ingestion of datasets from external APIs (NASA, ESA, ISRO).

    Responsibilities:
    - Connect to external APIs
    - Fetch raw JSON / CSV data
    - Apply basic preprocessing
    - Validate schema
    - Store data in Raw Dataset table
    """

    def __init__(self, db):
        self.db = db
        self.raw_repo = RawDatasetRepository(db)

        # Example API endpoints
        self.sources = {
            1: "https://images-api.nasa.gov/search",
            2: "https://gea.esac.esa.int/tap-server/tap/sync",
            3: "https://api.isro.gov.in/data",
        }

    # -------------------------------------------------
    # Main ingestion entry point
    # -------------------------------------------------

    def ingest_from_api(self, source_id: int, query: str, user_id: str) -> Dict[str, Any]:
        """
        Main ingestion workflow.
        Called when user selects 'Import from NASA / ESA'.
        """

        if source_id not in self.sources:
            raise ValueError("Unsupported data source")

        api_url = self.sources[source_id]

        raw_data = self._fetch_data(api_url, query)

        cleaned_data = self._preprocess(raw_data)

        validate_dataset_schema(cleaned_data)

        dataset_id = self.raw_repo.save_raw_dataset(
            user_id=user_id,
            source_id=source_id,
            data=cleaned_data,
        )

        return {
            "status": "success",
            "dataset_id": dataset_id,
            "records": len(cleaned_data),
        }

    # -------------------------------------------------
    # Fetch data from API
    # -------------------------------------------------

    def _fetch_data(self, url: str, query: str):

        params = {"q": query}

        response = requests.get(url, params=params, timeout=20)
        response.raise_for_status()

        content_type = response.headers.get("Content-Type", "")

        # JSON API
        if "application/json" in content_type:
            return response.json()

        # CSV API
        if "text/csv" in content_type:
            csv_data = response.text
            reader = csv.DictReader(io.StringIO(csv_data))
            return list(reader)

        raise ValueError("Unsupported API response format")

    # -------------------------------------------------
    # Basic preprocessing
    # -------------------------------------------------

    def _preprocess(self, data):

        if isinstance(data, dict):

            # NASA returns nested structure
            if "collection" in data and "items" in data["collection"]:
                data = data["collection"]["items"]

        cleaned = []

        for row in data:

            if not isinstance(row, dict):
                continue

            cleaned_row = {}

            for key, value in row.items():

                # Normalize column names
                clean_key = key.strip().lower().replace(" ", "_")

                if value is None or value == "":
                    continue

                cleaned_row[clean_key] = value

            if cleaned_row:
                cleaned.append(cleaned_row)

        return cleaned
import requests
from typing import Dict, Any, Union
from Backend.app.config import get_settings

settings = get_settings()


class APIIngestor:
    """
    Ingests data from external APIs and user uploads.
    Responsibilities:
    - Accept API-fetched data (NASA Image & Video Library)
    - Accept user-uploaded data
    - Validate basic schema
    - Pass raw data forward (no normalization here)
    """

    def __init__(self):
        # Load API credentials from .env via Settings
        self.base_url: str = settings.NASA_API_BASE_URL
        self.api_key: str = settings.NASA_API_KEY

    # -----------------------------
    # NASA API ingestion
    # -----------------------------
    def search_nasa_images(self, query: str) -> Dict[str, Any]:
        """
        Perform a search in NASA Image and Video Library.
        """
        url = f"{self.base_url}/search"
        params = {"q": query}
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()

    def get_asset(self, nasa_id: str) -> Dict[str, Any]:
        """
        Retrieve a media asset manifest.
        """
        url = f"{self.base_url}/asset/{nasa_id}"
        params = {"api_key": self.api_key}
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()

    def get_metadata(self, nasa_id: str) -> Dict[str, Any]:
        """
        Retrieve metadata location for a media asset.
        """
        url = f"{self.base_url}/metadata/{nasa_id}"
        params = {"api_key": self.api_key}
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()

    def get_captions(self, nasa_id: str) -> Dict[str, Any]:
        """
        Retrieve captions for a video asset.
        """
        url = f"{self.base_url}/captions/{nasa_id}"
        params = {"api_key": self.api_key}
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()

    def sanitize_query(user_input: str) -> str:
        """
        NASA API only supports keyword queries, not full sentences.
        This function strips filler words and keeps core terms.
        """
        # Very simple approach: take the last word or keywords
        tokens = user_input.lower().split()
        # Keep only alphabetic tokens
        keywords = [t for t in tokens if t.isalpha()]
        return " ".join(keywords)

    # -----------------------------
    # User-uploaded data ingestion
    # -----------------------------
    def ingest_user_data(self, data: Union[Dict[str, Any], Any]) -> Dict[str, Any]:
        """
        Accept user-uploaded raw data.
        Validates basic schema: must be a dict with required keys.
        """
        if not isinstance(data, dict):
            raise ValueError("Uploaded data must be a dictionary.")

        # Example schema validation: require 'id' and 'content'
        required_keys = {"id", "content"}
        missing = required_keys - data.keys()
        if missing:
            raise ValueError(f"Missing required fields: {', '.join(missing)}")

        # Pass raw data forward (no normalization here)
        return data

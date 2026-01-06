

import requests
from typing import Dict, Any
from app.config import get_settings

settings = get_settings()


class APIIngestor:
    """
    Ingests data from external APIs.
    """

    def __init__(self):
        self.base_url = settings.NASA_API_BASE_URL
        self.api_key = settings.NASA_API_KEY

    def search_nasa_images(self, query: str) -> Dict[str, Any]:
        """
        Perform a search in NASA Image and Video Library.
        """
        url = f"{self.base_url}/search"
        params = {"q": query, "api_key": self.api_key}
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

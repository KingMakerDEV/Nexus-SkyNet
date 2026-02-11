

from typing import Dict, Any


class SchemaMapper:
    """
    Maps raw payload fields into standardized schema.
    """

    @staticmethod
    def map_raw_to_standard(raw_payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Example mapping: raw NASA API payload → normalized schema.
        """
        normalized = {
            "dataset_name": raw_payload.get("title"),
            "nasa_id": raw_payload.get("nasa_id"),
            "description": raw_payload.get("description"),
            "keywords": raw_payload.get("keywords", []),
            "media_type": raw_payload.get("media_type"),
            "date_created": raw_payload.get("date_created"),
        }
        return normalized

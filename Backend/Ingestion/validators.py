

from typing import Dict, Any


class Validators:
    """
    Validation utilities for ingestion.
    """

    @staticmethod
    def validate_raw_payload(payload: Dict[str, Any]) -> bool:
        """
        Validate that raw payload contains required fields.
        """
        if not isinstance(payload, dict):
            raise ValueError("Payload must be a dictionary")

        # Example: require 'nasa_id' and 'title'
        required_fields = ["nasa_id", "title"]
        for field in required_fields:
            if field not in payload:
                raise ValueError(f"Missing required field: {field}")

        return True

    @staticmethod
    def validate_format(format: str) -> bool:
        """
        Validate that format is either JSON or CSV.
        """
        if format not in ["JSON", "CSV"]:
            raise ValueError("Format must be 'JSON' or 'CSV'")
        return True

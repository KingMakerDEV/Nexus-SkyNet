from typing import Dict, Any


class SchemaMapper:
    """
    Maps raw dataset fields into a canonical platform schema.
    """

    # Canonical schema keys expected across the platform
    CANONICAL_SCHEMA = {
        "timestamp",
        "source",
        "value",
        "unit",
        "latitude",
        "longitude",
        "id",
        "content",
    }

    # Known raw → canonical field mappings
    FIELD_MAP = {
        "obs_time": "timestamp",
        "observation_time": "timestamp",
        "time": "timestamp",
        "datetime": "timestamp",

        "temp_c": "value",
        "temperature_c": "value",
        "temperature": "value",
        "value": "value",

        "unit": "unit",
        "units": "unit",

        "lat": "latitude",
        "latitude": "latitude",

        "lon": "longitude",
        "long": "longitude",
        "longitude": "longitude",

        "src": "source",
        "origin": "source",
        "source": "source",

        "id": "id",
        "content": "content",
    }

    def map_schema(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convert arbitrary field names into canonical schema.
        """

        normalized: Dict[str, Any] = {}

        for key, value in record.items():

            if value is None or value == "":
                continue

            clean_key = key.strip().lower().replace(" ", "_")

            mapped_key = self.FIELD_MAP.get(clean_key, clean_key)

            normalized[mapped_key] = value

        # Ensure all canonical keys exist
        for key in self.CANONICAL_SCHEMA:
            normalized.setdefault(key, None)

        return normalized
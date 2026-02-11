

from sqlalchemy.orm import Session
from Backend.Models.raw_dataset import RawDataset
from Backend.Models.normalized_dataset import NormalizedDataset
from Backend.Normalization_Engine.coordinate_converter import CoordinateConverter
from Backend.Normalization_Engine.unit_converter import UnitConverter
from Backend.Normalization_Engine.schema_mapper import SchemaMapper


class NormalizationPipeline:
    """
    Runs normalization pipeline for raw datasets.
    """

    def __init__(self, db: Session):
        self.db = db

    def normalize_dataset(self, raw_dataset: RawDataset) -> NormalizedDataset:
        """
        Normalize a single raw dataset and persist result.
        """
        # Step 1: Map schema
        standardized_payload = SchemaMapper.map_raw_to_standard(raw_dataset.raw_payload)

        # Step 2: Example unit conversion (if payload has distance in miles)
        if "distance_miles" in raw_dataset.raw_payload:
            standardized_payload["distance_km"] = UnitConverter.miles_to_km(
                raw_dataset.raw_payload["distance_miles"]
            )

        # Step 3: Example coordinate conversion (if payload has lat/lon)
        if "lat" in raw_dataset.raw_payload and "lon" in raw_dataset.raw_payload:
            x, y, z = CoordinateConverter.latlon_to_cartesian(
                raw_dataset.raw_payload["lat"],
                raw_dataset.raw_payload["lon"]
            )
            standardized_payload["coordinates_cartesian"] = {"x": x, "y": y, "z": z}

        # Step 4: Persist normalized dataset
        normalized = NormalizedDataset(
            raw_dataset_id=raw_dataset.id,
            standardized_payload=standardized_payload,
            normalization_version="v1.0"
        )

        self.db.add(normalized)
        self.db.commit()
        self.db.refresh(normalized)

        return normalized

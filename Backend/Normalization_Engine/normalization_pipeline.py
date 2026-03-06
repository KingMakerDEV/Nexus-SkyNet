from typing import Dict, Any, List

from Normalization_Engine.schema_mapper import SchemaMapper
from Normalization_Engine.unit_converter import UnitConverter
from Normalization_Engine.coordinate_converter import CoordinateConverter

from repository.raw_repo import RawDatasetRepository
from repository.normalized_repo import NormalizedDatasetRepository


class NormalizationPipeline:
    """
    Orchestrates dataset normalization.

    Steps:
    1. Schema mapping
    2. Unit conversion
    3. Coordinate conversion
    4. Persist normalized dataset
    """

    def __init__(self, db):
        self.db = db

        self.raw_repo = RawDatasetRepository(db)
        self.normalized_repo = NormalizedDatasetRepository(db)

        self.schema_mapper = SchemaMapper()
        self.unit_converter = UnitConverter()
        self.coordinate_converter = CoordinateConverter()

    # -------------------------------------------------------
    # MAIN PIPELINE
    # -------------------------------------------------------

    def run(self, dataset_id: int) -> Dict[str, Any]:

        try:

            raw_dataset = self.raw_repo.get_raw_dataset(dataset_id)

            if not raw_dataset:
                raise ValueError("Raw dataset not found")

            raw_data = raw_dataset.data

            if not isinstance(raw_data, list):
                raise ValueError("Raw dataset format invalid")

            normalized_data = self._normalize_records(raw_data)

            normalized_dataset_id = self.normalized_repo.save_normalized_dataset(
                raw_dataset_id=dataset_id,
                data=normalized_data,
            )

            return {
                "status": "success",
                "normalized_dataset_id": normalized_dataset_id,
                "records": len(normalized_data),
            }

        except Exception as e:

            return {
                "status": "error",
                "error": str(e),
            }

    # -------------------------------------------------------
    # RECORD NORMALIZATION
    # -------------------------------------------------------

    def _normalize_records(self, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:

        normalized_records = []

        for record in records:

            try:

                mapped = self.schema_mapper.map_schema(record)

                converted_units = self.unit_converter.convert_units(mapped)

                converted_coordinates = self.coordinate_converter.convert_coordinates(
                    converted_units
                )

                normalized_records.append(converted_coordinates)

            except Exception:
                continue

        return normalized_records
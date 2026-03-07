import csv
import json
from typing import List, Dict, Any


class DatasetValidationError(Exception):
    """
    Custom exception for dataset validation errors.
    """
    pass


class DatasetValidator:
    """
    Flexible validator for CSV and JSON datasets.
    Accepts arbitrary schemas but ensures structural integrity.
    """

    @staticmethod
    def validate_csv(file_content: str) -> List[Dict[str, Any]]:
        try:
            reader = csv.DictReader(file_content.splitlines())
            rows = list(reader)

            if not rows:
                raise DatasetValidationError("CSV file is empty")

            if reader.fieldnames is None or len(reader.fieldnames) == 0:
                raise DatasetValidationError("CSV has no headers")

            for i, row in enumerate(rows):
                if not isinstance(row, dict):
                    raise DatasetValidationError(f"Row {i} is invalid")

            return rows

        except DatasetValidationError:
            raise
        except Exception as e:
            raise DatasetValidationError(f"CSV validation failed: {str(e)}")

    @staticmethod
    def validate_json(file_content: str) -> List[Dict[str, Any]]:
        try:
            data = json.loads(file_content)

            if isinstance(data, dict):
                data = [data]

            if not isinstance(data, list):
                raise DatasetValidationError("JSON must be an object or array")

            if len(data) == 0:
                raise DatasetValidationError("JSON dataset is empty")

            for i, row in enumerate(data):
                if not isinstance(row, dict):
                    raise DatasetValidationError(f"Row {i} must be an object")

            return data

        except json.JSONDecodeError:
            raise DatasetValidationError("Invalid JSON format")

        except DatasetValidationError:
            raise
        except Exception as e:
            raise DatasetValidationError(f"JSON validation failed: {str(e)}")


def validate_dataset_schema(file_content: str, file_type: str):
    """
    Entry point for dataset validation.
    """

    if file_type.upper() == "CSV":
        return DatasetValidator.validate_csv(file_content)

    if file_type.upper() == "JSON":
        return DatasetValidator.validate_json(file_content)

    raise DatasetValidationError("Unsupported dataset type")
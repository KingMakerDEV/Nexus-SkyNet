
import json
import csv
from typing import Any, Dict, List


class UserUploads:
    """
    Handles parsing of user-uploaded files.
    """

    def parse_json(self, file_content: str) -> Dict[str, Any]:
        """
        Parse JSON file content into a Python dict.
        """
        try:
            return json.loads(file_content)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON file: {e}")

    def parse_csv(self, file_content: str) -> List[Dict[str, Any]]:
        """
        Parse CSV file content into a list of dicts.
        """
        try:
            lines = file_content.splitlines()
            reader = csv.DictReader(lines)
            return [row for row in reader]
        except Exception as e:
            raise ValueError(f"Invalid CSV file: {e}")

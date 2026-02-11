

from typing import List, Dict, Any
from datetime import datetime
from Backend.Analytics.statistics import Statistics


class Aggregation:
    """
    Provides dataset-level aggregation utilities.
    """

    @staticmethod
    def aggregate_by_time(datasets: List[Dict[str, Any]], time_field: str = "date_created") -> Dict[str, Any]:
        """
        Group datasets into time windows and compute summary metrics.
        Example output: {"time_window": "2023–2024", "avg_brightness": 4.32, "range": [1.2, 8.9]}
        """
        values = []
        years = []

        for ds in datasets:
            if time_field in ds:
                try:
                    dt = datetime.fromisoformat(ds[time_field])
                    years.append(dt.year)
                except Exception:
                    continue
            if "brightness" in ds:
                values.append(ds["brightness"])

        if not years:
            return {}

        time_window = f"{min(years)}–{max(years)}"
        return {
            "time_window": time_window,
            "avg_brightness": Statistics.mean(values) if values else 0.0,
            "range": [Statistics.min_val(values), Statistics.max_val(values)] if values else [0.0, 0.0],
        }

    @staticmethod
    def aggregate_by_region(datasets: List[Dict[str, Any]], region_field: str = "coordinate_system") -> Dict[str, Any]:
        """
        Group datasets by coordinate region and compute counts.
        Example output: {"region_counts": {"Mars": 10, "Earth": 5}}
        """
        region_counts: Dict[str, int] = {}
        for ds in datasets:
            region = ds.get(region_field, "unknown")
            region_counts[region] = region_counts.get(region, 0) + 1
        return {"region_counts": region_counts}

    @staticmethod
    def aggregate_by_object_type(datasets: List[Dict[str, Any]], type_field: str = "object_type") -> Dict[str, Any]:
        """
        Group datasets by object type and compute rollups.
        Example output: {"object_rollups": {"star": {"count": 5}, "planet": {"count": 3}}}
        """
        rollups: Dict[str, Dict[str, Any]] = {}
        for ds in datasets:
            obj_type = ds.get(type_field, "unknown")
            if obj_type not in rollups:
                rollups[obj_type] = {"count": 0}
            rollups[obj_type]["count"] += 1
        return {"object_rollups": rollups}

    @staticmethod
    def compute_summary_metrics(values: List[float]) -> Dict[str, Any]:
        """
        Compute summary metrics from a list of numeric values.
        Example output: {"mean": 4.5, "median": 4.0, "std_dev": 0.8}
        """
        return Statistics.summary(values)

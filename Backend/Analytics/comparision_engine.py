from typing import Dict, Any, List
from Backend.Analytics.statistics import Statistics



class ComparisonEngine:
    """
    Provides dataset comparison utilities.
    """

    @staticmethod
    def compare_datasets(ds1: Dict[str, Any], ds2: Dict[str, Any]) -> Dict[str, Any]:
        """
        Field-to-field comparison between two normalized dataset payloads.
        Returns structured differences.
        """
        comparison: Dict[str, Any] = {}
        keys = set(ds1.keys()) | set(ds2.keys())

        for key in keys:
            val1 = ds1.get(key)
            val2 = ds2.get(key)

            if isinstance(val1, (int, float)) and isinstance(val2, (int, float)):
                change = Statistics.percent_change(val1, val2)
                comparison[key] = {
                    "dataset1": val1,
                    "dataset2": val2,
                    "percent_change": f"{change:+.2f}%"
                }
            else:
                comparison[key] = {
                    "dataset1": val1,
                    "dataset2": val2,
                    "equal": val1 == val2
                }

        return comparison

    @staticmethod
    def compare_time_series(ts1: List[float], ts2: List[float]) -> Dict[str, Any]:
        """
        Compare two numeric time-series lists.
        Detects trend (increase/decrease/stable) and difference metrics.
        """
        if not ts1 or not ts2:
            return {"trend": "no data"}

        mean1 = Statistics.mean(ts1)
        mean2 = Statistics.mean(ts2)
        change = Statistics.percent_change(mean1, mean2)

        if change > 5:
            trend = "increase"
        elif change < -5:
            trend = "decrease"
        else:
            trend = "stable"

        return {
            "mean1": mean1,
            "mean2": mean2,
            "percent_change": f"{change:+.2f}%",
            "trend": trend
        }

    @staticmethod
    def compute_similarity_score(ds1: Dict[str, Any], ds2: Dict[str, Any]) -> float:
        """
        Compute similarity score between two datasets using Euclidean distance.
        Normalizes score between 0 and 1 (closer = higher similarity).
        """
        numeric_keys = [k for k in ds1.keys() if isinstance(ds1.get(k), (int, float)) and isinstance(ds2.get(k), (int, float))]
        if not numeric_keys:
            return 0.0

        vec1 = [ds1[k] for k in numeric_keys]
        vec2 = [ds2[k] for k in numeric_keys]

        distance = Statistics.euclidean_distance(vec1, vec2)
        # Normalize: similarity = 1 / (1 + distance)
        similarity = 1 / (1 + distance)
        return round(similarity, 3)

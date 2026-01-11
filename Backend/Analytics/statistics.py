

import math
from typing import List, Dict, Any


class Statistics:
    """
    Low-level statistical computations.
    """

    @staticmethod
    def mean(values: List[float]) -> float:
        return sum(values) / len(values) if values else 0.0

    @staticmethod
    def median(values: List[float]) -> float:
        if not values:
            return 0.0
        sorted_vals = sorted(values)
        n = len(sorted_vals)
        mid = n // 2
        if n % 2 == 0:
            return (sorted_vals[mid - 1] + sorted_vals[mid]) / 2.0
        else:
            return sorted_vals[mid]

    @staticmethod
    def min_val(values: List[float]) -> float:
        return min(values) if values else 0.0

    @staticmethod
    def max_val(values: List[float]) -> float:
        return max(values) if values else 0.0

    @staticmethod
    def std_dev(values: List[float]) -> float:
        if not values:
            return 0.0
        mean_val = Statistics.mean(values)
        variance = sum((x - mean_val) ** 2 for x in values) / len(values)
        return math.sqrt(variance)

    @staticmethod
    def percent_change(a: float, b: float) -> float:
        """
        Percent change from a to b.
        """
        if a == 0:
            return float("inf") if b != 0 else 0.0
        return ((b - a) / abs(a)) * 100.0

    @staticmethod
    def euclidean_distance(vec1: List[float], vec2: List[float]) -> float:
        """
        Euclidean distance between two vectors.
        """
        if len(vec1) != len(vec2):
            raise ValueError("Vectors must be the same length")
        return math.sqrt(sum((x - y) ** 2 for x, y in zip(vec1, vec2)))

    @staticmethod
    def error_margin(values: List[float], confidence: float = 1.96) -> float:
        """
        Compute margin of error for a list of values.
        Default confidence = 95% (z-score = 1.96).
        """
        if not values:
            return 0.0
        mean_val = Statistics.mean(values)
        std_err = Statistics.std_dev(values) / math.sqrt(len(values))
        return confidence * std_err

    @staticmethod
    def summary(values: List[float]) -> Dict[str, Any]:
        """
        Return a small dictionary of metrics.
        """
        return {
            "mean": Statistics.mean(values),
            "median": Statistics.median(values),
            "min": Statistics.min_val(values),
            "max": Statistics.max_val(values),
            "std_dev": Statistics.std_dev(values),
            "error_margin": Statistics.error_margin(values),
        }

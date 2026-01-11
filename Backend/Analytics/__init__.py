# backend/app/analytics/__init__.py
"""
Analytics package initializer.

Exposes AggregationEngine, ComparisonEngine, and StatisticsEngine.
"""

from Backend.Analytics.aggrigation import AggregationEngine
from Backend.Analytics.comparision_engine import ComparisonEngine
from Backend.Analytics.statistics import StatisticsEngine

__all__ = ["AggregationEngine", "ComparisonEngine", "StatisticsEngine"]

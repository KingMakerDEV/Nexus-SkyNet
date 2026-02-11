# tests/test_normalization.py
"""
Core Purpose:
Verify that raw → normalized data transformations are:
- Correct
- Deterministic
- Unit-consistent
"""

import math
import pytest
from Backend.Services.normalization_service import NormalizationService


@pytest.fixture
def service():
    return NormalizationService()


# --- Unit Conversion Validation ---

def test_degrees_to_radians(service):
    raw = {"angle_deg": 180}
    normalized = service.normalize(raw)
    assert math.isclose(normalized["angle_rad"], math.pi, rel_tol=1e-9)


def test_meters_to_kilometers(service):
    raw = {"distance_m": 1000}
    normalized = service.normalize(raw)
    assert normalized["distance_km"] == 1.0


def test_seconds_to_days(service):
    raw = {"time_sec": 86400}
    normalized = service.normalize(raw)
    assert normalized["time_days"] == 1.0


# --- Coordinate System Checks ---

def test_coordinate_mapping(service):
    raw = {"ra_deg": 180, "dec_deg": -45}
    normalized = service.normalize(raw)
    assert "ra_rad" in normalized and "dec_rad" in normalized
    assert normalized["ra_rad"] > 0
    assert -math.pi/2 <= normalized["dec_rad"] <= math.pi/2


# --- Normalization Formula Accuracy ---

def test_known_input_accuracy(service):
    raw = {"distance_m": 5000}
    normalized = service.normalize(raw)
    assert math.isclose(normalized["distance_km"], 5.0, rel_tol=1e-9)


def test_floating_point_tolerance(service):
    raw = {"angle_deg": 90}
    normalized = service.normalize(raw)
    assert math.isclose(normalized["angle_rad"], math.pi/2, rel_tol=1e-9)


# --- Schema Conformance ---

def test_required_fields_present(service):
    raw = {"distance_m": 100}
    normalized = service.normalize(raw)
    assert "distance_km" in normalized
    assert isinstance(normalized["distance_km"], float)


def test_no_nulls_in_required_fields(service):
    raw = {"distance_m": 0}
    normalized = service.normalize(raw)
    assert normalized["distance_km"] is not None


# --- Determinism ---

def test_deterministic_output(service):
    raw = {"angle_deg": 45}
    first = service.normalize(raw)
    second = service.normalize(raw)
    assert first == second

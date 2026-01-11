
import pytest
from Backend.Services.analytic_services import AnalyticsService


@pytest.fixture
def service(db_session):
    # Assume db_session is a test fixture providing a mock or in-memory DB
    return AnalyticsService(db_session)


# --- Comparison Function Correctness ---

def test_expected_delta(service):
    result = service.compare_datasets("dataset_a", "dataset_b")
    assert "delta" in result
    assert isinstance(result["delta"], (int, float))


def test_percentage_change(service):
    result = service.compare_datasets("dataset_a", "dataset_b")
    assert "percentage_change" in result
    # Percentage change should be numeric
    assert isinstance(result["percentage_change"], (int, float))


def test_ratio_computation(service):
    result = service.compare_datasets("dataset_a", "dataset_b")
    assert "ratio" in result
    assert result["ratio"] >= 0


# --- Cross-Dataset Consistency ---

def test_units_already_normalized(service):
    result = service.compare_datasets("dataset_a", "dataset_b")
    # Ensure no raw values leaked
    for key in result.keys():
        assert "raw" not in key.lower()


def test_comparable_scale(service):
    result = service.compare_datasets("dataset_a", "dataset_b")
    assert "scale_consistent" in result
    assert result["scale_consistent"] is True


# --- Edge Case Handling ---

def test_zero_division_safety(service):
    result = service.compare_datasets("dataset_zero", "dataset_nonzero")
    assert result["ratio"] != float("inf")
    assert result["ratio"] != float("nan")


def test_missing_values_handled(service):
    result = service.compare_datasets("dataset_with_missing", "dataset_b")
    assert "handled_missing" in result
    assert result["handled_missing"] is True


def test_partial_overlap(service):
    result = service.compare_datasets("dataset_partial_a", "dataset_partial_b")
    assert "overlap" in result
    assert isinstance(result["overlap"], float)


# --- Symmetry Checks ---

def test_directionality_preserved(service):
    ab = service.compare_datasets("dataset_a", "dataset_b")
    ba = service.compare_datasets("dataset_b", "dataset_a")
    # Directional metrics should differ
    assert ab["delta"] == -ba["delta"]


def test_asymmetry_expected(service):
    ab = service.compare_datasets("dataset_a", "dataset_b")
    ba = service.compare_datasets("dataset_b", "dataset_a")
    assert ab != ba


# --- Output Contract ---

def test_schema_contract(service):
    result = service.compare_datasets("dataset_a", "dataset_b")
    required_fields = ["delta", "percentage_change", "ratio", "scale_consistent"]
    for field in required_fields:
        assert field in result

    # Ensure no unexpected raw values
    for key in result.keys():
        assert not key.startswith("raw_")

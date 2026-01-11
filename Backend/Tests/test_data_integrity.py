

import pytest
from sqlalchemy.orm import Session
from Backend.repository.normalized_repo import NormalizedRepository
from Backend.repository.metadata_repo import MetadataRepository
from Backend.repository.raw_repo import RawRepository


@pytest.fixture
def repos(db_session: Session):
    return {
        "normalized": NormalizedRepository(db_session),
        "metadata": MetadataRepository(db_session),
        "raw": RawRepository(db_session),
    }


# --- Referential Integrity ---

def test_foreign_keys_intact(repos):
    normalized = repos["normalized"].get_all()
    for ds in normalized:
        # Each normalized dataset must have a valid raw_dataset_id
        raw = repos["raw"].get_by_id(ds.raw_dataset_id)
        assert raw is not None, f"Orphan normalized record found: {ds.id}"


def test_correct_dataset_ownership(repos):
    metadata_entries = repos["metadata"].get_all()
    for m in metadata_entries:
        raw = repos["raw"].get_by_id(m.raw_dataset_id)
        assert raw is not None, f"Metadata {m.id} has no valid raw dataset owner"


# --- Uniqueness & Duplication ---

def test_no_duplicate_normalized_entries(repos):
    normalized = repos["normalized"].get_all()
    seen_hashes = set()
    for ds in normalized:
        assert ds.hash not in seen_hashes, f"Duplicate normalized entry found: {ds.id}"
        seen_hashes.add(ds.hash)


def test_source_based_uniqueness(repos):
    normalized = repos["normalized"].get_all()
    sources = [ds.source_id for ds in normalized]
    assert len(sources) == len(set(sources)), "Duplicate source-based normalized entries detected"


# --- Versioning Integrity ---

def test_versions_do_not_overwrite(repos):
    raw_entries = repos["raw"].get_all()
    for raw in raw_entries:
        versions = [m.version for m in repos["metadata"].get_by_raw_dataset(raw.id)]
        assert len(versions) == len(set(versions)), f"Version overwrite detected for raw dataset {raw.id}"


def test_historical_data_preserved(repos):
    raw_entries = repos["raw"].get_all()
    for raw in raw_entries:
        metadata = repos["metadata"].get_by_raw_dataset(raw.id)
        assert len(metadata) >= 1, f"No historical metadata preserved for raw dataset {raw.id}"


# --- Completeness Checks ---

def test_required_metrics_present(repos):
    normalized = repos["normalized"].get_all()
    for ds in normalized:
        required_fields = ["distance_km", "angle_rad", "time_days"]
        for field in required_fields:
            assert getattr(ds, field, None) is not None, f"Missing required field {field} in dataset {ds.id}"


def test_no_silent_field_loss(repos):
    normalized = repos["normalized"].get_all()
    for ds in normalized:
        # Ensure schema fields are not silently dropped
        schema_fields = ["id", "raw_dataset_id", "distance_km", "angle_rad", "time_days"]
        for field in schema_fields:
            assert hasattr(ds, field), f"Field {field} missing in normalized dataset {ds.id}"


# --- Corruption Detection ---

def test_invalid_ranges(repos):
    normalized = repos["normalized"].get_all()
    for ds in normalized:
        assert ds.angle_rad >= 0, f"Invalid angle value in dataset {ds.id}"
        assert ds.distance_km >= 0, f"Negative distance detected in dataset {ds.id}"


def test_impossible_values(repos):
    normalized = repos["normalized"].get_all()
    for ds in normalized:
        assert ds.time_days >= 0, f"Negative time detected in dataset {ds.id}"
        assert ds.distance_km < 1e12, f"Unrealistic distance detected in dataset {ds.id}"

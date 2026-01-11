

import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from Backend.Database.database import get_db
from Backend.repository.normalized_repo import NormalizedRepository
from Backend.repository.metadata_repo import MetadataRepository
from Backend.repository.raw_repo import RawRepository

router = APIRouter()


@router.get("/data/normalized")
def list_normalized_datasets(db: Session = Depends(get_db)):
    """
    List all normalized datasets.
    """
    repo = NormalizedRepository(db)
    datasets = repo.get_all()
    return [{"id": str(ds.id), "payload": ds.standardized_payload} for ds in datasets]


@router.get("/data/normalized/{dataset_id}")
def get_dataset(dataset_id: uuid.UUID, db: Session = Depends(get_db)):
    """
    Fetch a single normalized dataset by ID.
    """
    repo = NormalizedRepository(db)
    dataset = repo.get_by_id(dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return {"id": str(dataset.id), "payload": dataset.standardized_payload}


@router.get("/data/metadata/{dataset_id}")
def get_dataset_metadata(dataset_id: uuid.UUID, db: Session = Depends(get_db)):
    """
    Fetch metadata for a normalized dataset.
    """
    repo = MetadataRepository(db)
    metadata = repo.get_by_raw_dataset(str(dataset_id))
    if not metadata:
        raise HTTPException(status_code=404, detail="Metadata not found")
    return [{"id": str(m.id), "payload": m.metadata_payload} for m in metadata]


@router.get("/data/raw/status/{dataset_id}")
def get_raw_status(dataset_id: uuid.UUID, db: Session = Depends(get_db)):
    """
    Fetch raw ingestion status (read-only).
    """
    repo = RawRepository(db)
    raw = repo.get_by_id(str(dataset_id))
    if not raw:
        raise HTTPException(status_code=404, detail="Raw dataset not found")
    return {"id": str(raw.id), "is_processed": raw.is_processed, "format": raw.format}

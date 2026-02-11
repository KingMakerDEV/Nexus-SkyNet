# Backend/api/analytics_routes.py
"""
Analytics & Comparison Endpoints

Purpose:
- Expose deterministic analysis and comparison results.

Responsibilities:
- Accept dataset IDs for comparison
- Call AnalyticsService
- Return structured comparison metrics

Must NOT:
- Implement comparison logic
- Store comparison results manually
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from Backend.Database.database import get_db
from Backend.Services.analytic_services import AnalyticsService

router = APIRouter()


@router.post("/analytics/compare")
def compare_datasets(
    dataset_a: uuid.UUID,
    dataset_b: uuid.UUID,
    db: Session = Depends(get_db),
):
    """
    Compare two normalized datasets by ID.
    Delegates to AnalyticsService.
    """
    service = AnalyticsService(db)
    result = service.compare_datasets(dataset_a, dataset_b)

    if result.get("status") == "error":
        raise HTTPException(status_code=404, detail=result["reason"])

    return result


@router.get("/analytics/summary/{dataset_id}")
def dataset_summary(dataset_id: uuid.UUID, db: Session = Depends(get_db)):
    """
    Get structured summary of a normalized dataset.
    Delegates to AnalyticsService.
    """
    service = AnalyticsService(db)
    result = service.get_dataset_summary(dataset_id)

    if result.get("status") == "error":
        raise HTTPException(status_code=404, detail=result["reason"])

    return result


import uuid
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from Backend.Services.ingestion_service import IngestionService

router = APIRouter()


@router.post("/ingest/api")
def ingest_api(
    source_id: int,
    query: str = Form(...),
    user_id: uuid.UUID = Form(...),
    db: Session = Depends(get_db),
):
    """
    Trigger ingestion from external API (e.g., NASA).
    """
    if not query:
        raise HTTPException(status_code=400, detail="Query string is required")

    service = IngestionService(db)
    result = service.ingest_from_api(source_id=source_id, query=query, user_id=user_id)
    return result


@router.post("/ingest/upload")
def upload_dataset(
    source_id: int,
    user_id: uuid.UUID = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload a dataset file (CSV or JSON).
    """
    if file.content_type not in ["application/json", "text/csv"]:
        raise HTTPException(status_code=400, detail="Only JSON or CSV files are supported")

    file_content = file.file.read().decode("utf-8")
    file_type = "JSON" if file.content_type == "application/json" else "CSV"

    service = IngestionService(db)
    result = service.ingest_user_upload(
        file_content=file_content,
        file_type=file_type,
        user_id=user_id,
        source_id=source_id,
    )
    return result

from flask import Blueprint, request, jsonify, g
from Services.ingestion_service import IngestionService
from middleware.auth_middleware import jwt_required
from app.extionsions import db


ingestion_bp = Blueprint("ingestion", __name__, url_prefix="/ingestion")


# -----------------------------
# UPLOAD DATASET (CSV / JSON)
# -----------------------------
@ingestion_bp.route("/upload", methods=["POST"])
@jwt_required
def upload_dataset():

    if "file" not in request.files:
        return jsonify({
            "status": "error",
            "message": "No file provided"
        }), 400

    file = request.files["file"]
    source_id = request.form.get("source_id")

    # user extracted from JWT middleware
    user_id = g.user_id

    if not source_id:
        return jsonify({
            "status": "error",
            "message": "source_id is required"
        }), 400

    if file.filename == "":
        return jsonify({
            "status": "error",
            "message": "File name missing"
        }), 400

    try:

        file_content = file.read().decode("utf-8")

        # Detect file type
        if file.filename.endswith(".json"):
            file_type = "JSON"
        else:
            file_type = "CSV"

        service = IngestionService(db)

        result = service.ingest_user_upload(
            file_content=file_content,
            file_type=file_type,
            filename=file.filename,
            user_id=user_id,
            source_id=int(source_id)
        )



        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# -----------------------------
# NORMALIZE DATASET
# -----------------------------
@ingestion_bp.route("/normalize/<dataset_id>", methods=["POST"])
@jwt_required
def normalize_dataset(dataset_id):

    try:

        service = IngestionService(db)

        result = service.normalize_dataset(dataset_id)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# -----------------------------
# INGEST FROM EXTERNAL API
# -----------------------------
@ingestion_bp.route("/ingest/api", methods=["POST"])
@jwt_required
def ingest_api():

    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "JSON body required"
        }), 400

    source_id = data.get("source_id")
    query = data.get("query")

    user_id = g.user_id

    if not source_id or not query:
        return jsonify({
            "status": "error",
            "message": "source_id and query are required"
        }), 400

    try:

        service = IngestionService(db)

        result = service.ingest_from_api(
            source_id=int(source_id),
            query=query,
            user_id=user_id
        )

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# -----------------------------
# AVAILABLE SOURCES
# -----------------------------
@ingestion_bp.route("/sources", methods=["GET"])
def get_sources():

    sources = [
        {
            "id": 1,
            "name": "NASA",
            "icon": "🚀",
            "description": "NASA Exoplanet Archive, MAST, etc."
        },
        {
            "id": 2,
            "name": "ESA",
            "icon": "🛸",
            "description": "Gaia, XMM-Newton, Herschel data"
        },
        {
            "id": 3,
            "name": "Observatory",
            "icon": "🔭",
            "description": "Ground-based observations"
        },
        {
            "id": 4,
            "name": "Other",
            "icon": "📡",
            "description": "Custom or third-party sources"
        }
    ]

    return jsonify({
        "status": "success",
        "sources": sources
    }), 200
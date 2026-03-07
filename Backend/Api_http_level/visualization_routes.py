from flask import Blueprint, jsonify, g
from middleware.auth_middleware import jwt_required
from Services.visualization_service import VisualizationService
from app.extionsions import db

visualization_bp = Blueprint('visualization', __name__, url_prefix='/visualize')

@visualization_bp.route('/<normalized_dataset_id>', methods=['GET'])
@jwt_required
def get_visualization(normalized_dataset_id):
    service = VisualizationService(db)
    result = service.get_visualization(normalized_dataset_id)
    # If result is a tuple with status code, handle it
    if isinstance(result, tuple) and len(result) == 2:
        return jsonify(result[0]), result[1]
    return jsonify(result), 200
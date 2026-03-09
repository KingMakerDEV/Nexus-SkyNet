from flask import Blueprint, jsonify, g, request
from middleware.auth_middleware import optional_auth, get_user_from_token
from Services.visualization_service import VisualizationService
from app.extionsions import db
from utils.jwt_helper import verify_visualization_token
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

visualization_bp = Blueprint('visualization', __name__, url_prefix='/visualize')


@visualization_bp.route('/<normalized_dataset_id>', methods=['GET'])
@optional_auth
def get_visualization(normalized_dataset_id):
    logger.debug(f"="*50)
    logger.debug(f"VISUALIZATION REQUEST RECEIVED")
    logger.debug(f"Dataset ID: {normalized_dataset_id}")
    logger.debug(f"Auth header: {request.headers.get('Authorization', 'None')}")
    
    auth_header = request.headers.get('Authorization', '')
    
    # Case 1: Try visualization token first
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        logger.debug(f"Token received (first 20 chars): {token[:20]}...")
        
        # Try to verify as visualization token
        viz_payload = verify_visualization_token(token, normalized_dataset_id)
        
        if viz_payload:
            logger.debug(f"✓ Valid visualization token for dataset: {viz_payload.get('dataset_id')}")
            # Valid visualization token - proceed
            service = VisualizationService(db)
            logger.debug("Calling VisualizationService.get_visualization()...")
            result = service.get_visualization(normalized_dataset_id)
            logger.debug(f"Service returned: {type(result)}")
            
            if isinstance(result, tuple) and len(result) == 2:
                logger.debug(f"Returning tuple response with status {result[1]}")
                return jsonify(result[0]), result[1]
            logger.debug("Returning JSON response")
            return jsonify(result), 200
    
    logger.debug("No valid visualization token found, trying user auth")
    
    # Case 2: Fall back to user authentication
    user = get_user_from_token(auth_header)
    if not user:
        logger.error("✗ No valid authentication found")
        return jsonify({"error": "Unauthorized - Valid token required"}), 401
    
    logger.debug(f"✓ User authenticated: {user.get('id')}")
    
    # User is authenticated - proceed with user token
    service = VisualizationService(db)
    logger.debug("Calling VisualizationService.get_visualization() with user auth...")
    result = service.get_visualization(normalized_dataset_id)
    logger.debug(f"Service returned: {type(result)}")
    
    if isinstance(result, tuple) and len(result) == 2:
        logger.debug(f"Returning tuple response with status {result[1]}")
        return jsonify(result[0]), result[1]
    logger.debug("Returning JSON response")
    return jsonify(result), 200
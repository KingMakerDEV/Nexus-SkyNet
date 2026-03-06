from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from app.extionsions import db
from app.config import Config

# Blueprints
from Api_http_level.auth_routes import auth_bp
from Api_http_level.ingestion_routes import ingestion_bp


def create_app():
    # Load environment variables
    load_dotenv()

    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    # Initialize database
    db.init_app(app)

    # Enable CORS
    CORS(app)

    # Register blueprints
    app.register_blueprint(auth_bp)        # Authentication routes
    app.register_blueprint(ingestion_bp)   # Dataset ingestion + normalization

    # Auto-create tables (development only)
    with app.app_context():
        db.create_all()

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
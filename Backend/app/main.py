# from flask import Flask
# from flask_cors import CORS
#
# from app.extensions import db
# from app.config import Config
# from Api_http_level.auth_routes import auth_bp
#
#
# def create_app():
#     app = Flask(__name__)
#     app.config.from_object(Config)
#
#     db.init_app(app)
#
#     CORS(app)
#
#     app.register_blueprint(auth_bp, url_prefix="/auth")
#
#     return app

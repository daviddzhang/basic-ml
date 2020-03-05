from flask import Flask
from app.configs import ProductionConfig
from app.general.routes import bp as general_bp

def create_app(config_object=ProductionConfig):
    app = Flask(__name__)
    app.config.from_object(config_object)
    app.register_blueprint(general_bp)

    return app
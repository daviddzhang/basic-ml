from flask import Flask
from flask_cors import CORS

from app.configs import Config
from app.learning_curves.routes import bp as lcurve_bp
from app.linear_regression.routes import bp as linreg_bp


def create_app(config_object=Config):
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(config_object)
    app.register_blueprint(linreg_bp)
    app.register_blueprint(lcurve_bp)

    return app
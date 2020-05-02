from flask import Flask

from app.configs import ProductionConfig
from app.learning_curves.routes import bp as lcurve_bp
from app.linear_regression.routes import bp as linreg_bp


def create_app(config_object=ProductionConfig):
    app = Flask(__name__)
    app.config.from_object(config_object)
    app.register_blueprint(linreg_bp)
    app.register_blueprint(lcurve_bp)

    return app
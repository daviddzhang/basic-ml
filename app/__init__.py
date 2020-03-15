from flask import Flask
from app.configs import ProductionConfig
from app.linear_regression.routes import bp as linreg_bp

def create_app(config_object=ProductionConfig):
    app = Flask(__name__)
    app.config.from_object(config_object)
    app.register_blueprint(linreg_bp)

    return app
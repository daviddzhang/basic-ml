import os
from app import create_app
from app.configs import DevelopmentConfig

app = create_app(DevelopmentConfig) if os.environ.get('FLASK_ENV') == 'development' else create_app()

if __name__ == "__main__":
    app.run()
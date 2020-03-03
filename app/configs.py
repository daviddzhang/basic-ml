import os
from dotenv import load_dotenv
load_dotenv()

class Config(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.environ.get('FLASKML_SECRET')
    DATABASE_URI = 'postgresql://localhost:5432/flask_ml'

class ProductionConfig(Config):
    DATABASE_URI = ''

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
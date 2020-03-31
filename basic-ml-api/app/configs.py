import os
from dotenv import load_dotenv
load_dotenv()

PROD_DATABASE_URI = os.environ.get('PROD_POSTGRES_URI')
DEV_DATABASE_URI = os.environ.get('DEV_POSTGRES_URI')
TEST_DATABASE_URI = os.environ.get('TEST_POSTGRES_URI')

class Config(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.environ.get('FLASKML_SECRET')

class ProductionConfig(Config):
    DATABASE_URI = PROD_DATABASE_URI

class DevelopmentConfig(Config):
    DEBUG = True
    DATABASE_URI = DEV_DATABASE_URI

class TestingConfig(Config):
    TESTING = True
    DEBUG = True
    DATABASE_URI = TEST_DATABASE_URI
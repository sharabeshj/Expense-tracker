import os

class BaseConfig:
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'M\xa3\xcc]*|\x93R\x08|\xc0\xab4\x80S\xf8\xad\x8e\xb9\xa4\x0c\xd8\xf4\x84'

class DevelopmentConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_TEST_URL')

class ProductionConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
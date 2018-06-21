import os

from flask import Flask
from flask_cors import CORS
from flask_debugtoolbar import DebugToolbarExtension
from flask_sqlachemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()
toolbar = DebugToolbarExtension()

def create_app(script_info = None):

    app = Flask(__name__)

    CORS(app)

    app_settings = os.getenv('APP_SETTINGS')
    app.config.from_object(app_settings)

    toolbar.init_app(app)
    db.init_app(app)
    migrate.init_app(app)

    from project.api.base import base_blueprint
    app.register_blueprint(base_blueprint)
    from project.api.expenses import expense_blueprint
    app.register_blueprint(expense_blueprint)

    app.shell_context_processor({ 'app' : app, 'db' : db})
    return app
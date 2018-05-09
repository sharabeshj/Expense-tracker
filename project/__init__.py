#imports
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

#config
app = Flask(__name__,instance_relative_config=True)
app.config.from_pyfile('flask.cfg')

db = SQLAlchemy(app) 
migrate = Migrate(app,db)

#blueprints 
from project.users.views import users_blueprint
from project.expenses.views import expenses_blueprint

app.register_blueprint(users_blueprint)
app.register_blueprint(expenses_blueprint)

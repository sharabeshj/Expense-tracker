#imports
from flask import Flask,jsonify,request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from functools import wraps
import jwt


#config
app = Flask(__name__)

app.config.from_object('project.config.DevelopmentConfig')


db = SQLAlchemy(app)
migrate = Migrate(app,db)


from .models import User

#token_required
def token_required(f):
    @wraps(f)
    def decorated(*args,**kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message' : 'Token is missing'}),401
        try:
            data = jwt.decode(token,app.config['SECRET_KEY'])
            current_user = User.query.filter_by(public_id = data['public_id']).first()
        except:
            return jsonify({'message' : 'Token is invalid'})
        
        return f(current_user,*args,**kwargs)

    return decorated


#blueprints 
from . import views
from project.users.views import users_blueprint
from project.aws.views import aws_blueprint
from project.expenses.views import expenses_blueprint

app.register_blueprint(users_blueprint)
app.register_blueprint(aws_blueprint)
app.register_blueprint(expenses_blueprint)



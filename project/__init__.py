#imports
from flask import Flask,jsonify,request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from functools import wraps
import jwt


#config
app = Flask(__name__,instance_relative_config=True)
app.config.from_pyfile('flask.cfg')


db = SQLAlchemy(app)
 
migrate = Migrate(app,db)


from .models import User
from . import views

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

# #oauth_config
# oauth = OAuth(app)

# oauth.register('fyle',
#     client_id = 'tpaWTytgNOxUO',
#     client_secret = 'sharabesh',
#     request_token_url = 'https://staging.fyle.in/api/oauth/token',
#     request_token_params = { 'code': code, client_id: client_id, client_secret: client_secret, grant_type: ‘authorization_code’ }
#     access_token_url = 'https://staging.fyle.in/api/oauth/token',
#     access_token_params = { client_id : client_id,client_secret : client_secret,grant_type : refresh_token,refresh_token : fetch_token },
#     refresh_token_url = 'https://staging.fyle.in/api/oauth/token',
#     authorize_url = 'https://staging.fyle.in/#/simple/oauth?client_id=client_id',
#     api_base_url = 'https://staging.fyle.in/api',
#     fetch_token = fetch_token
# )

#blueprints 
from project.users.views import users_blueprint
from project.expenses.views import expenses_blueprint

app.register_blueprint(users_blueprint)
app.register_blueprint(expenses_blueprint)



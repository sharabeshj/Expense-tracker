from flask import request,make_response,jsonify,render_template
from werkzeug.security import check_password_hash
import jwt
import datetime
from . import app,token_required
from project.models import User

@app.route('/obtain-auth')
def login():
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return make_response('Could not verify',401,{'WWW-Authenticate' : 'Basic realm="Login required"'})

    user = User.query.filter_by(email = auth.username).first()

    if not user:
        return make_response('Could not verify',401,{'WWW-Authenticate' : 'Basic realm="Login required"'})
    
    if(check_password_hash(user.password,auth.password)):
        token = jwt.encode({'public_id' : user.public_id,'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes = 30)},app.config['SECRET_KEY'])

        return jsonify({'token' : token.decode('UTF-8')})

    return make_response('Could not verify',401,{'WWW-Authenticate' : 'Basic realm="Login required"'})

@app.route('/authorizationCredentials')
@token_required
def authorizationCredentials(current_user):
    return jsonify({ "client_id" : 'tpaWTytgNOxUO', 'client_secret' : 'sharabesh'})
from flask import jsonify,make_response,request
from . import app
import jwt

@app.route('/checkToken',methods = ['POST'])
def checkToken():
    req_data = request.get_json()
    print(req_data)
    try:
        data = jwt.decode(req_data['token'],app.config['SECRET_KEY'])
        return jsonify({ 'message' : 'token is valid'})
    except:
        return make_response('Token is invalid',401)

@app.route('/authorizationCredentials')
def authorizationCredentials():
    return jsonify({ "client_id" : 'tpaWTytgNOxUO', 'client_secret' : 'sharabesh'})
from flask import jsonify,make_response,request
import requests
from . import app,db
from project.models import User,Fyle_tokens
import jwt
import datetime
import json

@app.route('/checkToken',methods = ['POST'])
def checkToken():
    req_data = request.get_json()
    print(req_data)
    try:
        jwt.decode(req_data['token'],app.config['SECRET_KEY'])
        return jsonify({ 'message' : 'token is valid'})
    except:
        return make_response('Token is invalid',401)

@app.route('/refreshToken',methods = ['POST'])
def RefreshToken():
    reqDataDict = request.get_json()
    reqDataDict['grant-type'] = 'refresh_type'
    reqDataDict['client_id'] = 'tpaWTytgNOxUO'
    reqDataDict['client_secret'] = 'sharabesh'
    current_user = User.query.filter_by(public_id = reqDataDict['user_id']).first()
    if not current_user:
        return make_response('No user found',401)
    fyle_token = Fyle_tokens.query.filter_by(user_id = current_user.id).first()
    tokens = json.loads(fyle_token.tokens)
    reqDataDict['refresh_token'] = tokens['refresh_token']
    print(reqDataDict)
    res = requests.post(url = 'https://staging.fyle.in/api/oauth/token',json = reqDataDict)
    resDict = json.loads(res.text)
    print(resDict)
    if res.status_code == 200:
        tokens['access_token'] = resDict['access_token']
        fyle_token.tokens = json.dumps(tokens)
        db.session.commit()
        token = jwt.encode({'public_id' : current_user.public_id,'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes = 60)},app.config['SECRET_KEY'])
        return jsonify({ 'token' : token })
    return jsonify({ ' message ' : 'error occured'})

@app.route('/authorizationCredentials')
def authorizationCredentials():
    return jsonify({ "client_id" : 'tpaWTytgNOxUO', 'client_secret' : 'sharabesh'})
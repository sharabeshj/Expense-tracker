import os 
from flask import Blueprint,jsonify

from project.api.utils import authenticate

base_blueprint = Blueprint('base',__name__)

@base_blueprint.route('/base',methods = ['GET'])
@authenticate
def index(resp):
    return jsonify({
        'message' : resp['data']['email']
    })

@base_blueprint.route('/base/authorizationCredentials')
def auth_cred():
    return jsonify({ 'client_id' : os.environ.get('CLIENT_ID')})
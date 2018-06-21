from flask import Blueprint,jsonify

from project.api.utils import authenticate

base_blueprint = Blueprint('base',__name__)

@base_blueprint.route('/base',methods = ['GET'])
@authenticate
def index(resp):
    return jsonify({
        'message' : resp['data']['email']
    })
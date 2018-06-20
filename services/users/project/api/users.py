from flask import Blueprint,jsonify

users_blueprint = Blueprint('users',__name__)

@users_blueprint.route('/users',methods = ['GET'])
def index():
    return jsonify({
        'message' : 'success'
    })

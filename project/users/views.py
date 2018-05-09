from flask import Blueprint,request,jsonify,make_response
from project  import db
from project.models import User
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import datetime

users_blueprint = Blueprint('users',__name__)

@users_blueprint.route('/',methods = ['GET'])
def get_all_users():
    users = User.query.all()
    output = []

    for user in users:
        user_data = {}
        user_data['public_id'] = user.public_id
        user_data['email'] = user.email
        user_data['admin'] = user.admin
        output.append(user_data)
    
    return jsonify({'users' : output})

@users_blueprint.route('/<public_id>',methods = ['GET'])
def get_one_user(public_id):
    user = User.query.filter_by(public_id = public_id).first()

    if not user:
        return jsonify({'message' : 'user not found!'})

    user_data = {}
    user_data['public_id'] = user.public_id
    user_data['email'] = user.email
    user_data['admin'] = user.admin

    return jsonify({'user' : user_data})

@users_blueprint.route('/',methods = ['POST'])
def create_user():
    data = request.get_json()

    hashed_password = generate_password_hash(data['password'],method = 'sha256')

    new_user = User(public_id = str(uuid.uuid4()),email = data['email'],password = hashed_password,admin = False)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message' : 'new user created'})

@users_blueprint.route('/<public_id>',methods = ['PUT'])
def promote_user(public_id):
    user = User.query.filter_by(public_id = public_id).first()
    
    if not user:
        return jsonify({'message' : 'no user found'})
    
    user.admin = True 
    db.session.commit()

    return jsonify({'message' : 'the user has been promoted'})

@users_blueprint.route('/<public_id>',methods = ['DELETE'])
def delete_user(public_id):
    user = User.query.filter_by(public_id = public_id).first()

    if not user:
        return jsonify({'message' : 'no user found'})

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message' : 'The user has been deleted'})


from flask import Blueprint,request,jsonify,make_response,session
from project  import db,token_required,app
from project.models import User,Fyle_tokens
from werkzeug.security import generate_password_hash
import datetime
import jwt
import json


users_blueprint = Blueprint('users',__name__)

@users_blueprint.route('/users')
def create_user():
    new_user = User(public_id = session['user_id'],email = session['username'],admin = False,created_at = datetime.datetime.now(),updated_at = datetime.datetime.now())
    token = jwt.encode({'public_id' : new_user.public_id,'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes = 30)},app.config['SECRET_KEY'])
    db.session.add(new_user)
    db.session.commit()
    current_user = User.query.filter_by(public_id = session['user_id']).first()
    newFyleToken = Fyle_tokens(created_at = datetime.datetime.now(),updated_at = datetime.datetime.now(),user_id = current_user.id,username = session['username'],tokens = json.dumps(session['res_text']))
    db.session.add(newFyleToken)
    db.session.commit()
    return jsonify({ 'token' : token.decode('UTF-8'),'user_id' : current_user.public_id })


@users_blueprint.route('/user/<public_id>',methods = ['PUT'])
@token_required
def promote_user(current_user,public_id):
    user = User.query.filter_by(public_id = public_id).first()
    
    if not user:
        return jsonify({'message' : 'no user found'})
    
    user.admin = True 
    user.updated_at = datetime.datetime.now()
    db.session.commit()

    return jsonify({'message' : 'the user has been promoted'})

@users_blueprint.route('/user/<public_id>',methods = ['DELETE'])
@token_required
def delete_user(current_user,public_id):
    if not current_user.admin:
        return jsonify({'message' : 'Cannot perform that action'})
        
    user = User.query.filter_by(public_id = public_id).first()

    if not user:
        return jsonify({'message' : 'no user found'})

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message' : 'The user has been deleted'})


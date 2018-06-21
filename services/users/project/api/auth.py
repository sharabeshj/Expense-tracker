import datetime
from flask import Blueprint,jsonify,request
from sqlalchemy import exc,or_

from project.api.models import User
from project import db

auth_blueprint = Blueprint('auth',__name__)

@auth_blueprint.route('/auth/register',methods = ['POST'])
def register_user():
    post_data = request.get_json()
    response_object = {
        'status' : 'fail',
        'message' : 'Invalid payload'
    }
    if not post_data:
        return jsonify(response_object),400
    email = post_data.get('email')
    try : 
        user = User.query.filter(
            or_(User.email == email )
        ).first()
        if not user:
            new_user = User(
                email = email,
                created_at = datetime.datetime.utcnow(),
                active = True
            )
            db.session.add(new_user)
            db.session.commit()

            auth_token = new_user.encode_auth_token(new_user.id)
            response_object['status'] = 'success'
            response_object['message'] = 'Successfully registered.'
            response_object['auth_token'] = auth_token.decode()
            return jsonify(response_object),201
        else:
            response_object['message'] = 'Sorry. That user already exists.'
            return jsonify(response_object), 400
    
    except (exc.IntegrityError,ValueError) as e:
        db.session.rollback()
        return jsonify(response_object), 400

@auth_blueprint.route('/auth/login',methods = ['POST'])
def login_user():
    post_data = request.get_json()
    response_object = {
        'status' : 'fail',
        'message' : 'Invald payload'
    }
    if not post_data:
        return jsonify(response_object), 400
    
    email = post_data.get('email')
    try:
        user = User.query.filter_by(email =email).first()
        if user :
            auth_token = user.encode_auth_token(user.id)
            if auth_token:
                response_object['status'] = 'success'
                response_object['message'] = 'Successfully logged in.'
                response_object['auth_token'] = auth_token.decode()
                return jsonify(response_object), 200
        else:
            response_object['message'] = 'User does not exist.'
            return jsonify(response_object), 404
    except Exception as e:
        response_object['message'] = 'Try again.'
        return jsonify(response_object), 500

@auth_blueprint.route('/auth/logout',methods = ['GET'])
def logout_user():

    auth_header = request.headers.get('Authorization')
    response_object = {
        'status' : 'fail',
        'message' : 'Invalid token. Please log in again.'
    }
    if auth_header:
        auth_token = auth_header.split(' ')[1]
        resp = User.decode_auth_token(auth_token)
        if not isinstance(resp,str):
            response_object['status'] = 'success'
            response_object['message'] = 'Successfully logged out.'
            return jsonify(response_object), 200
        else:
            response_object['message'] = 'Please log in again.'
            return jsonify(response_object), 401
    else:
        return jsonify(response_object), 403
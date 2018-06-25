import datetime
from flask import Blueprint,jsonify,request,redirect,url_for
from sqlalchemy import exc,or_

from project.api.models import User
from project import db
from project.api.utils import authenticate

auth_blueprint = Blueprint('auth',__name__)

@auth_blueprint.route('/auth/register',methods = ['POST'])
def register_user():
    post_data = request.get_json()
    print(post_data)
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
            return redirect(url_for('auth.login_user'),code = 307)
    
    except (exc.IntegrityError,ValueError) as e:
        db.session.rollback()
        return jsonify(response_object), 400

@auth_blueprint.route('/auth/login',methods = ['POST'])
def login_user():
    post_data = request.get_json()
    response_object = {
        'status' : 'fail',
        'message' : 'Invalid payload'
    }
    if not post_data:
        return jsonify(response_object), 400
    
    email = post_data.get('email')
    try:
        user = User.query.filter_by(email =email).first()
        if user :
            user.active = True
            db.session.commit()
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
@authenticate
def	logout_user(resp):
	response_object={
		'status':'success',
		'message':'Successfully	logged out.'
	}
	return	jsonify(response_object),200


@auth_blueprint.route('/auth/status',methods = ['GET'])
@authenticate
def get_user_status(resp):

    user  = User.query.filter_by(id = resp).first()
    response_object = {
        'status' : 'success',
        'message' : 'success',
        'data' : user.to_json()
    }
    # print(response_object)
    return jsonify(response_object), 200
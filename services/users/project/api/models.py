import datetime
import jwt
from flask import current_app

from project import db

class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer,primary_key = True,autoincrement = True)
    email = db.Column(db.String(128),unique = True, nullable = False)
    created_at = db.Column(db.DateTime)
    active = db.Column(db.Boolean(),default = True)


    def __repr__(self):
        return 'User {}'.format(self.public_id)
    
    def to_json(self):
        return {
            'id' : self.id,
            'email' : self.email,
            'created_at' : self.created_at,
            'active' : self.active
        }

    def encode_auth_token(self,user_id):
        try:
            payload = {
                'exp' : datetime.datetime.utcnow() + datetime.timedelta(
                    days = current_app.config.get('TOKEN_EXPIRATION_DAYS'),
                    minutes = current_app.config.get('TOKEN_EXPIRATION_SECONDS')
                ),
                'iat' : datetime.datetime.utcnow(),
                'sub' : user_id
            }
            return jwt.encode(
                payload,
                current_app.config.get('SECRET_KEY'),
                algorithm='HS256'
            )
        except Exception as e:
            return e
    
    @staticmethod
    def decode_auth_token(auth_token):
        try:
            payload = jwt.decode(
                auth_token,current_app.config.get('SECRET_KEY')
            )
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'
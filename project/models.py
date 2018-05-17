from . import  db
from sqlalchemy.dialects.postgresql import JSON


class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer,primary_key = True)
    public_id = db.Column(db.String(50),unique = True)
    email = db.Column(db.String,unique = True, nullable = False)
    password = db.Column(db.String,nullable = False)
    admin = db.Column(db.Boolean)
    expense = db.relationship('Expense',backref = 'user',lazy = True)

    def __init__(self,public_id,email,password,admin):
        self.public_id = public_id
        self.email = email
        self.password = password
        self.admin = admin

    def __repr__(self):
        return 'User {}'.format(self.public_id)


class Expense(db.Model):
    __tablename__ = "expenses"

    id = db.Column(db.Integer,primary_key = True)
    expense_details = db.Column(JSON)
    user_id = db.Column(db.Integer,db.ForeignKey('users.id'),nullable = False)

    def  __init__(self,expense_details,expense_id):
        self.expense_id = expense_id
        self.expense_details = expense_details

    def __repr__(self):
        return 'id {}'.format(self.id)

# class OAuth2Token(db.Model):
#     user_id = db.Column(db.Integer, nullable=False)
#     name = db.Column(db.String(20), nullable=False)

#     token_type = db.Column(db.String(20))
#     access_token = db.Column(db.String(48), nullable=False)
#     refresh_token = db.Column(db.String(48))
#     expires_at = db.Column(db.Integer, default=0)

#     def to_token(self):
#         return dict(
#             access_token=self.access_token,
#             token_type=self.token_type,
#             refresh_token=self.refresh_token,
#             expires_at=self.expires_at,
#         )
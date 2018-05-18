from . import  db
from sqlalchemy.dialects.postgresql import JSON


class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer,primary_key = True)
    public_id = db.Column(db.String(50),unique = True)
    email = db.Column(db.String,unique = True, nullable = False)
    password = db.Column(db.String,nullable = False)
    admin = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    expense = db.relationship('Expense',backref = 'user',lazy = True)

    def __init__(self,public_id,email,password,admin,created_at,updated_at):
        self.public_id = public_id
        self.email = email
        self.password = password
        self.admin = admin
        self.created_at = created_at
        self.updated_at = updated_at

    def __repr__(self):
        return 'User {}'.format(self.public_id)


class Expense(db.Model):
    __tablename__ = "expenses"

    id = db.Column(db.Integer,primary_key = True)
    expense_details = db.Column(JSON)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    ext_expense_id = db.Column(db.String)
    user_id = db.Column(db.Integer,db.ForeignKey('users.id'),nullable = False)

    def  __init__(self,expense_details,expense_id,created_at,updated_at):
        self.expense_id = expense_id
        self.expense_details = expense_details
        self.created_at = created_at
        self.updated_at = updated_at

    def __repr__(self):
        return 'id {}'.format(self.id)

class Fyle_tokens(db.Model):
    __tablename__ = "fyle_tokens"

    user_id = db.Column(db.Integer, nullable=False,primary_key = True)
    name = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    refresh_token = db.Column(db.String(48))

    def to_token(self):
        return dict(
            refresh_token=self.refresh_token,
        )
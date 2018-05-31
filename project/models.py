from . import  db
from sqlalchemy.dialects.postgresql import JSON


class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer,primary_key = True)
    public_id = db.Column(db.String,unique = True)
    email = db.Column(db.String,unique = True, nullable = False)
    password = db.Column(db.String,nullable = True)
    admin = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    expense = db.relationship('Expense',backref = 'user',lazy = True)
    fyleToken = db.relationship('Fyle_tokens',backref = 'user',lazy = True)

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
    
    def __repr__(self):
        return 'id {}'.format(self.id)

class Fyle_tokens(db.Model):
    __tablename__ = "fyle_tokens"

    user_id = db.Column(db.Integer,db.ForeignKey('users.id'),primary_key = True,nullable = False)
    username = db.Column(db.String,primary_key = True)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    tokens = db.Column(JSON)
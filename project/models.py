from . import  db

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
    expense_id = db.Column(db.String,unique = True,nullable = False)
    date = db.Column(db.DateTime)
    details = db.Column(db.String)
    amount = db.Column(db.Integer)
    source = db.Column(db.String)
    user_id = db.Column(db.Integer,db.ForeignKey('users.id'),nullable = False)

    def  __init__(self,expense_id,date,details,amount,source,user_id):
        self.expense_id = expense_id
        self.data = date
        self.details = details
        self.amount = amount
        self.source = source
        self.user_id = user_id

    def __repr__(self):
        return 'id {}'.format(self.id)


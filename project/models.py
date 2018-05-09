from project import  db

class Expense(db.Model):
    __tablename__ = "expenses"

    id = db.Column(db.Integer,primary_key = True)
    date = db.Column(db.DateTime)
    details = db.Column(db.String)
    amount = db.Column(db.Integer)
    source = db.Column(db.String)

    def  __init__(self,date,details,amount,source):
        self.data = date
        self.details = details
        self.amount = amount
        self.source = source

    def __repr__(self):
        return 'id {}'.format(self.id)

class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer,primary_key = True)
    email = db.Column(db.String,unique = True, nullable = False)
    password = db.Column(db.String,nullable = False)

    def __init__(self,email,password):
        self.email = email
        self.password = password

    def __repr__(self):
        return 'User {}'.format(self.)
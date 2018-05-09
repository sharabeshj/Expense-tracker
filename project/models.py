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
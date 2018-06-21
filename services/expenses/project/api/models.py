from sqlalchemy.dialects.postgresql import JSON

from project import db

class Expense(db.Model):
    __tablename__ = "expenses"

    id = db.Column(db.Integer,primary_key = True)
    expense_details = db.Column(JSON)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    ext_expense_id = db.Column(db.String)
    user_id = db.Column(db.Integer,nullable = False)
    
    def __repr__(self):
        return 'id {}'.format(self.id)

    def to_json(self):
        return {
            'id' : self.id,
            'expense_details' : self.expense_details,
            'created_at' : self.created_at,
            'updated_at' : self.updated_at,
            'ext_expense_id' : self.ext_expense_id,
            'user_id' : self.user_id
        }

class Fyle_tokens(db.Model):
    __tablename__ = "fyle_tokens"

    user_id = db.Column(db.Integer,primary_key = True,nullable = False)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    tokens = db.Column(JSON)

    def to_json(self):
        return {
            'user_id' : self.user_id,
            'created_at' : self.created_at,
            'updated_at' : self.updated_at,
            'tokens' : self.tokens
        }
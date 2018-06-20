from project import db

class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer,primary_key = True,autoincrement = True)
    public_id = db.Column(db.String,unique = True)
    email = db.Column(db.String(128),unique = True, nullable = False)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    # expense = db.relationship('Expense',backref = 'user',lazy = True)
    # fyleToken = db.relationship('Fyle_tokens',backref = 'user',lazy = True)

    def __repr__(self):
        return 'User {}'.format(self.public_id)
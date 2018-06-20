from project import db
from project.api.models import User

def add_user(email):
    user = User(email = email)
    db.session.add(user)
    db.session.commit()
    return user
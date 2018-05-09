from project import db
from project.models import Expense

db.create_all()

expense1 = Expense('27/08/18','irctc','2000','web_app')
expense2 = Expense('02/04/18','uber','3000','mobilr')

db.session.add(expense1)
db.session.add(expense2)

db.session.commit()
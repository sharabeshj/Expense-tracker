from sqlalchemy import exc
from flask import Blueprint,jsonify,request

from project import db
from project.api.models import Expense,Fyle_tokens
from project.api.utils import authenticate

expense_blueprint = Blueprint('expenses',__name__)

@expense_blueprint.route('/expenses',methods = ['GET'])
def get_all_expenses():
    response_object = {
        'status' : 'success',
        'data' : {
            'expenses' : [ex.to_json() for ex in Expense.query.all()]
        }
    }
    return jsonify(response_object), 200
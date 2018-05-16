from flask import Blueprint,request,jsonify
from project.models import Expense
from project import db,token_required


expenses_blueprint = Blueprint('expenses',__name__)

@expenses_blueprint.route('/expenses',methods = ['GET'])
@token_required
def get_all_expenses(current_user):
    expenses = Expense.query.filter_by(user_id = current_user.id).all()

    output = []

    for expense in expenses:
        expense_data = expense.expense_details
        output.append(expense_data)

    return jsonify({'expenses' : output})

@expenses_blueprint.route('/expense/<expense_id>',methods = ['GET'])
@token_required
def get_one_expense(current_user,expense_id):
    expense = Expense.query.filter_by(expense_id = expense_id,user_id = current_user.id)

    if not expense:
        return jsonify({'message' : 'No expenses to show'})
        
    expense_data = expense.expense_details

    return jsonify({'expense' : expense_data})

@expenses_blueprint.route('/expenses',methods = ['POST'])
@token_required
def create_expense(current_user):
    data = request.get_json()

    new_expense = Expense(expense_id = data['expense_id'],date = data['date'],details = data['details'],amount = data['amount'],source = data['source'],user_id = current_user.id)
    db.session.add(new_expense)
    db.session.commit()

    return jsonify({'message' : 'New expense has been created'})

@expenses_blueprint.route('/expense/<expense_id>',methods = ['PUT'])
@token_required
def edit_expense(current_user,expense_id):
    data = request.get_json()

    expense = Expense.query.filter_by(expense_id = expense_id,user_id = current_user.id).first()
    
    if not expense:
        return jsonify({'message' : 'No expense found'})
    
    expense.expense_details = data
    db.session.commit()

    return jsonify({'message' : 'expense has been updated'})

@expenses_blueprint.route('/expense/<expense_id>',methods = ['DELETE'])
@token_required
def delete_expense(current_user,expense_id):
    expense = Expense.query.filter_by(expense_id = expense_id,user_id = current_user.id).first()

    if not expense:
        return jsonify({'message': 'Expense not found'})

    db.session.delete(expense)
    db.commit()

    return jsonify({'message' : 'Expense deleted'})

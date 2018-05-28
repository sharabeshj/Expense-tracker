from flask import Blueprint,request,jsonify,make_response
from project.models import Expense,Fyle_tokens
from project import db,token_required
import requests
import json
from werkzeug.wrappers import Response
import datetime


expenses_blueprint = Blueprint('expenses',__name__)

@expenses_blueprint.route('/expensesToken',methods = ['POST'])
@token_required
def TokenGen(current_user):
    headers = request.headers
    data = request.data
    res = requests.post(url='https://staging.fyle.in/api/oauth/token',headers = headers,data = data)
    fyle_token = Fyle_tokens.query.filter_by(user_id = current_user.id).first()
    if not fyle_token:
        new_fyle_token =  Fyle_tokens(user_id = current_user.id,created_at = datetime.datetime.now(),updated_at = datetime.datetime.now(),tokens = res.text)
        db.session.add(new_fyle_token)
        db.session.commit()
        return jsonify({ "message" : "Token saved" })
    resDict = json.loads(res.text)
    tokens = json.loads(fyle_token.tokens)
    tokens['refresh_token'] = resDict['refresh_token']
    tokens['access_token'] = resDict['access_token']
    fyle_token.tokens = json.dumps(tokens)
    db.session.commit()

    return jsonify({ "message" : "Token saved" })

@expenses_blueprint.route('/expensesRefresh',methods = ['GET'])
@token_required
def RefreshToken(current_user):
    headers = request.headers
    dataDict = { 'grant_type' : 'refresh_token'}
    fyle_token = Fyle_tokens.query.filter_by(user_id = current_user.id).first()
    tokens = json.loads(fyle_token.tokens)
    dataDict['refresh_token'] = tokens['refresh_token']
    dataDict['client_id'] = 'tpaWTytgNOxUO'
    dataDict['client_secret'] = 'sharabesh'
    res = requests.post(url = 'https://staging.fyle.in/api/oauth/token',headers = headers,json = dataDict)
    resDict = json.loads(res.text)
    tokens['access_token'] = resDict['access_token']
    fyle_token.tokens = json.dumps(tokens)
    db.session.commit()

    return jsonify({ "message" : "access-token updated successfully" })

@expenses_blueprint.route('/expensesFetchAPI',methods = ['GET'])
@token_required
def fetchAPI(current_user):
    fyle_token = Fyle_tokens.query.filter_by(user_id = current_user.id).first()
    tokens = json.loads(fyle_token.tokens) 
    access_token = tokens['access_token']
    res = requests.get(url = 'https://staging.fyle.in/api/transactions',headers = { "X-AUTH-TOKEN" : access_token })
    resDict = json.loads(res.text)
    for expense in resDict:
        old_expense = Expense.query.filter_by(user_id = current_user.id,ext_expense_id = expense['id']).first()
        if not old_expense:
            new_expense = Expense(user_id = current_user.id,expense_details = json.dumps(expense),created_at = expense['created_at'],updated_at = expense['updated_at'],ext_expense_id = expense['id'])
            db.session.add(new_expense)
            db.session.commit()
    return jsonify({ "expenses" : res.text })

@expenses_blueprint.route('/expenses',methods = ['GET'])
@token_required
def get_all_expenses(current_user):
    expenses = Expense.query.filter_by(user_id = current_user.id).all()

    output = []

    for expense in expenses:
        expense_data = {}
        expense_data['expense_details'] = expense.expense_details
        expense_data['created_at'] = expense.created_at
        expense_data['updated_at'] = expense.updated_at
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

    new_expense = Expense(created_at = data['created_at'],updated_at = data['updated_at'],expense_details = data['details'],user_id = current_user.id)
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

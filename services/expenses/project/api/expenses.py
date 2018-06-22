import os
import requests
import json
import datetime

from sqlalchemy import exc
from flask import Blueprint,jsonify,request,current_app

from project import db
from project.api.models import Expense,Fyle_tokens
from project.api.utils import authenticate,ensure_authenticated

expense_blueprint = Blueprint('expenses',__name__)

@expense_blueprint.route('/expenses',methods = ['GET'])
@authenticate
def get_all_expenses(resp):
    response_object = {
        'status' : 'success',
        'data' : {
            'expenses' : [ex.to_json() for ex in Expense.query.all()]
        }
    }
    return jsonify(response_object), 200

@expense_blueprint.route('/expensesToken',methods = ['POST'])
def TokenGen():
    dataDict = request.get_json()
    response_object = {
        'status' : 'fail',
        'message' : 'error occured'
    }
    dataDict['client_id'] = os.environ.get('CLIENT_ID')
    dataDict['client_secret'] = os.environ.get('CLIENT_SECRET')
    dataDict['grant_type'] = 'authorization_code'
    resToken = requests.post(url = 'https://staging.fyle.in/api/oauth/token', headers = { 'Content-Type' : 'Application/json'}, json= dataDict)
    resTokenDict = json.loads(resToken.text)
    if resToken.status_code == 200:
        resCred = requests.get('https://staging.fyle.in/api/eous/current', headers = { 'x-auth-token' : resTokenDict['access_token']})
        if resCred.status_code == 200:
            print('hi')
            resCredDict = json.loads(resCred.text)
            url = '{0}/auth/register'.format(current_app.config['USERS_SERVICE_URL'])
            data = {}
            data['email'] = resCredDict['us_email']
            response = requests.post(url = url,data = json.dumps(data))
            print(response.text)
            responseDict = json.loads(response.text)
            if responseDict['status'] == 'success':
                status = ensure_authenticated(responseDict['auth_token'])
                old_fyle_token = Fyle_tokens.query.filter_by(user_id = status['data']['id']).first()
                if not old_fyle_token:
                    new_fyle_token = Fyle_tokens(created_at = datetime.datetime.utcnow(),updated_at = datetime.datetime.utcnow(),user_id = status['data']['id'],tokens = json.dumps(resTokenDict))
                    db.session.add(new_fyle_token)
                    db.session.commit()
                    response_object['status'] = 'success'
                    response_object['message'] = 'fyle token created'
                    response_object['auth_token'] = responseDict['auth_token']
                    return jsonify(response_object), 200
                tokens = json.loads(old_fyle_token.tokens)
                tokens['access_token'] = resTokenDict['access_token']
                old_fyle_token.tokens = json.dumps(tokens)
                db.session.commit()
                response_object['status'] = 'success'
                response_object['message'] = 'fyle token updated'
                response_object['auth_token'] = responseDict['auth_token']
                return jsonify(response_object), 200
    return jsonify(response_object), 500

@expense_blueprint.route('/expensesFetchAPI',methods = ['GET'])
@authenticate
def fetchAPI(resp):
    response_object = {
        'status' : 'fail',
        'message' : 'error occured'
    }
    fyle_token = Fyle_tokens.query.filter_by(user_id = resp.id).first()
    tokens = json.loads(fyle_token.tokens)
    access_token = tokens['access_token']
    res = requests.get(url = 'https://staging.fyle.in/api/extns/company', headers = { "x-auth-token" : access_token })
    resDict = json.loads(res.text)
    if res.status_code == 200:
        for expense in resDict:
            old_expense = Expense.query.filter_by(ext_expense_id = expense['tx_id']).first()
            if not old_expense:
                new_expense = Expense(user_id = resp.id,expense_details = json.dumps(expense),created_at = expense['tx_txn_dt'],ext_expense_id = expense['tx_id'])
                db.session.add(new_expense)
                db.session.commit()
        response_object['status'] = 'success'
        response_object['message'] = 'expenses updated'
        return jsonify(response_object), 200
    return jsonify(response_object), 500
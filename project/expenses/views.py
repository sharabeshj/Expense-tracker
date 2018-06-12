from flask import Blueprint,request,jsonify,make_response,session,redirect,send_file
from project.models import Expense,Fyle_tokens,User
from project import db,token_required,app,excel
import requests
import json
from werkzeug.wrappers import Response
import datetime
import jwt 
import zipfile
from slugify import slugify
import io
import time
import pathlib

expenses_blueprint = Blueprint('expenses',__name__)

@expenses_blueprint.route('/expensesToken',methods = ['POST'])
def TokenGen():
    dataDict = request.get_json()
    dataDict['client_id'] = 'tpaWTytgNOxUO'
    dataDict['client_secret'] = 'sharabesh'
    dataDict['grant_type'] = 'authorization_code'
    resToken = requests.post(url='https://staging.fyle.in/api/oauth/token',headers = {'Content-Type' : 'Application/json'},json = dataDict)
    resTokenDict = json.loads(resToken.text)
    print(resTokenDict)
    if resToken.status_code == 200:
        resCred = requests.get('https://staging.fyle.in/api/eous/current',headers = { 'x-auth-token' : resTokenDict['access_token']})
        if resCred.status_code == 200:
            resCredDict = json.loads(resCred.text)
            old_user = User.query.filter_by(public_id = resCredDict['us_id']).first()
            if not old_user:
                session['username'] = resCredDict['us_email']
                session['user_id'] = resCredDict['us_id']
                session['res_text'] = resTokenDict
                return redirect('/users')
            token = jwt.encode({'public_id' : old_user.public_id,'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes = 60)},app.config['SECRET_KEY'])
            fyle_token = Fyle_tokens.query.filter_by(user_id = old_user.id).first()
            tokens = json.loads(fyle_token.tokens)
            tokens['access_token'] = resTokenDict['access_token']
            fyle_token.tokens = json.dumps(tokens)
            db.session.commit()
            return jsonify({ 'token' : token.decode('UTF-8'),'user_id' : old_user.public_id })
    return  jsonify({ 'message' : 'error occured'})
   

@expenses_blueprint.route('/expensesFetchAPI',methods = ['GET'])
@token_required
def fetchAPI(current_user):
    fyle_token = Fyle_tokens.query.filter_by(user_id = current_user.id).first()
    tokens = json.loads(fyle_token.tokens) 
    access_token = tokens['access_token']
    res = requests.get(url = 'https://staging.fyle.in/api/etxns/company',headers = { "X-AUTH-TOKEN" : access_token })
    resDict = json.loads(res.text)
    print(resDict)
    for expense in resDict:
        old_expense = Expense.query.filter_by(ext_expense_id = expense['tx_id']).first()
        if not old_expense:
            new_expense = Expense(user_id = current_user.id,expense_details = json.dumps(expense),created_at = expense['tx_txn_dt'],updated_at = expense['tx_created_at'],ext_expense_id = expense['tx_id'])
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

@expenses_blueprint.route('/expenses-csv',methods = ['POST'])
@token_required
def csv_data(current_user):
    data = request.get_json()
    expense_list = Expense.query.filter_by(user_id = current_user.id).all()
    fyle_token = Fyle_tokens.query.filter_by(user_id = current_user.id).first()
    tokens = json.loads(fyle_token.tokens) 
    access_token = tokens['access_token']
    if data is not None:
        csv = []
        for id in data['list']:
            data_csv = {}
            for i in expense_list:
                if i.ext_expense_id == id:
                    data_csv['expense_details'] = i.expense_details
            csv.append(data_csv)
        filename = '{}_report'.format(slugify(current_user.email))
    
        csv_list = [[filename],['id','user-email','date','vendor-name','category','amount']]
        
        for each in csv:
            expense = json.loads(each['expense_details'])
            url = 'https://staging.fyle.in/api/files?transaction_id='+expense['tx_id']
            result = requests.get(url,headers = { "X-AUTH-TOKEN" : access_token })
            if result.status_code == 200 and result.text is not []:
                resultDict = json.loads(result.text)
                data = io.BytesIO()
                with zipfile.ZipFile(data,"w") as z:
                    for f in resultDict:
                        resFileURL = requests.post('https://staging.fyle.in/api/files/'+f['id']+'/download_url',headers = { "X-AUTH-TOKEN" : access_token })
                        resFileURLDict = json.loads(resFileURL.text)
                        
                        resFile = requests.get(resFileURLDict['url'])
                        location = '/tmp/' +f['name']
                        fp = open(location,'wb') 
                        fp.write(resFile.content)
                        fp.close()
                        file_data = zipfile.ZipInfo('/tmp/'+f['name'])
                        file_data.date_time = time.localtime(time.time())[:6]
                        file_data.compress_type = zipfile.ZIP_DEFLATED
                        with open('/tmp/'+f['name'],encoding = "ISO-8859-1") as fd:
                            read_data = fd.read()
                        fd.close()  
                        z.writestr(file_data,read_data)
                data.seek(0) 
                print(data.read())
                return send_file(
                        data,
                        as_attachment=True,
                        attachment_filename='data.zip',
                    )
    return make_response('error',500)
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

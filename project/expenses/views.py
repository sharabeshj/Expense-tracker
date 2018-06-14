from flask import Blueprint,request,jsonify,make_response,session,redirect,send_file
from project.models import Expense,Fyle_tokens,User
from project import db,token_required,app
import requests
import json
from werkzeug.wrappers import Response
import datetime
import jwt 
import zipfile
from slugify import slugify
import io
import time
import os
import tempfile
import shutil
import csv
import errno

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
        csv_content = []
        for id in data['list']:
            data_csv = {}
            for i in expense_list:
                if i.ext_expense_id == id:
                    data_csv['expense_details'] = i.expense_details
            csv_content.append(data_csv)
        filename = '{}_report'.format(slugify(current_user.email))
    
        csv_list = [[filename],['id','user-email','date','vendor-name','category','amount']]
        tmpdir = tempfile.mkdtemp()
        for each in csv_content:
            expense = json.loads(each['expense_details'])
            url = 'https://staging.fyle.in/api/files?transaction_id='+expense['tx_id']
            result = requests.get(url,headers = { "X-AUTH-TOKEN" : access_token })
            if result.status_code == 200 and result.text is not []:
                resultDict = json.loads(result.text)
                for f in resultDict:
                    resFileURL = requests.post('https://staging.fyle.in/api/files/'+f['id']+'/download_url',headers = { "X-AUTH-TOKEN" : access_token })
                    resFileURLDict = json.loads(resFileURL.text)
                    
                    resFile = requests.get(resFileURLDict['url'])
                    fname = 'attachments/'+expense['tx_created_at']+'/'+f['name']
                    path = os.path.join(tmpdir,fname)
                    if not os.path.exists(os.path.dirname(path)):
                        try:
                            os.makedirs(os.path.dirname(path))
                        except OSError as exc:
                            if exc.errno != errno.EEXIST:
                                raise

                    with open(path,"wb") as tmp:
                        tmp.write(resFile.content)
            csv_list.append([expense['tx_id'],
                expense['us_email'],
                expense['tx_created_at'],
                expense['tx_platform_vendor'],
                expense['tx_currency'],
                expense['tx_amount']
            ])
        new_path = os.path.join(tmpdir,'report.csv')
        with open(new_path,"w") as f:
            wr = csv.writer(f,delimiter = ',',quoting=csv.QUOTE_ALL)
            wr.writerows(csv_list)
        try:
            root_path = os.path.sep.join(app.instance_path.split(os.path.sep)[:-1])
            print(os.path.abspath(os.path.join(root_path,'data.zip')))
            zf  = zipfile.ZipFile(os.path.abspath(os.path.join(root_path,'data.zip')),"w",zipfile.ZIP_DEFLATED)
            abs_src = os.path.abspath(tmpdir)
            for dirname,subdirs,files in os.walk(tmpdir):
                for filename in files:
                    absname = os.path.abspath(os.path.join(dirname,filename))
                    arcname = absname[len(abs_src)+1:]
                    print ('zipping %s as %s' % (os.path.join(dirname,filename),arcname))
                    zf.write(absname,arcname)
            zf.close()
        finally:
            shutil.rmtree(tmpdir,ignore_errors = True)
        print(os.path.abspath(os.path.join(root_path,'data.zip')))
        return redirect('/aws-create')


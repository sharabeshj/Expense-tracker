from flask import Blueprint,make_response,jsonify
from project import token_required,app
import boto3 
import os

aws_blueprint = Blueprint('aws',__name__)

@aws_blueprint.route('/aws-create')
@token_required
def create_aws(current_user):
    s3 = boto3.client('s3')
    bucket_name = 'fyle-attachments-dev'
    root_path = os.path.sep.join(app.instance_path.split(os.path.sep)[:-1])
    s3.upload_file(os.path.abspath(os.path.join(root_path,'data.zip')),bucket_name,'data.zip')
    url = s3.generate_presigned_url(
        ClientMethod = 'get_object',
        Params = {
            'Bucket' : 'fyle-attachments-dev',
            'Key' : 'data.zip'
        }
    )
    return jsonify({ "url" : url })


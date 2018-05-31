from flask import jsonify
from . import app,token_required

@app.route('/authorizationCredentials')
def authorizationCredentials():
    return jsonify({ "client_id" : 'tpaWTytgNOxUO', 'client_secret' : 'sharabesh'})
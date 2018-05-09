from flask import render_template,Blueprint

expenses_blueprint = Blueprint('expenses',__name__)

@expenses_blueprint.route('/')
def index():
    return render_template('index.html')
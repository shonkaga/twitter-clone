from flask import render_template,request,Blueprint
from components.models import User


core = Blueprint('core',__name__)

@core.route('/')
def index():
    users = User.query.all()
    return render_template('index.html', users=users)

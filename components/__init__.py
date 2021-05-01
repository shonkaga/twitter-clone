import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager

# create flask instance
app = Flask(__name__)

# create secret key
app.config['SECRET_KEY'] = '1%gn&jG6g&*ffd%4fbJ'

# database setup
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# create database instance
db = SQLAlchemy(app)
Migrate(app,db)

# set up login manager
login_manager = LoginManager()
login_manager.init_app(app)
# go the login view if page requires login
login_manager.login_view = "users.login"

#import and register blueprints
from components.core.views import core
app.register_blueprint(core)

from components.users.views import users
app.register_blueprint(users)

from components.error_pages.handlers import error_pages
app.register_blueprint(error_pages)

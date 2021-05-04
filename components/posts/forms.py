# Form Based Imports
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, TextAreaField
from wtforms.validators import DataRequired,Email,EqualTo
from wtforms import ValidationError
from flask_wtf.file import FileField, FileAllowed

# User Based Imports
from flask_login import current_user
from components.models import User

'''
This form will be used to be able to write a new post.
'''
class WritePost(FlaskForm):
    # text for the post
    text = TextAreaField('Text',validators=[DataRequired(message='please write something to post')])
    picture = FileField('Add optional photo', validators=[FileAllowed(['jpg', 'png','jpeg','bmp','bmp','gif','webp'],message="This file type is not allowed")])
    submit = SubmitField('Post')

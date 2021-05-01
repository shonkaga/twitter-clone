from flask import render_template, url_for, flash, redirect, request, Blueprint
from flask_login import login_user, current_user, logout_user, login_required
from components import db
from werkzeug.security import generate_password_hash,check_password_hash
from components.models import User
from components.users.forms import RegistrationForm, LoginForm, UpdateUserForm
from components.users.picture_handler import add_profile_pic

# setting the users blueprint
users = Blueprint('users', __name__)

@users.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()

    if form.validate_on_submit():

        user = User(email=form.email.data,
                    username=form.username.data,
                    password=form.password.data)

        db.session.add(user)
        db.session.commit()
        flash('Thanks for registering! Now you can login!')
        return redirect(url_for('users.login'))
    return render_template('register.html', form=form)


@users.route('/login', methods=['GET', 'POST'])
def login():

    form = LoginForm()
    if form.validate_on_submit():
        # Grab the user from our User Models table

        user = User.query.filter_by(email=form.email.data).first()

        # Check that the user was supplied and the password is right
        # The verify_password method comes from the User object
        # https://stackoverflow.com/questions/2209755/python-operation-vs-is-not

        if user.check_password(form.password.data):
            #Log in the user

            login_user(user)
            flash('Logged in successfully.')

            # If a user was trying to visit a page that requires a login
            # flask saves that URL as 'next'.
            next = request.args.get('next')

            # So let's now check if that next exists, otherwise we'll go to
            # the welcome page.
            if next == None or not next[0]=='/':
                next = url_for('core.index')

            return redirect(next)
        else:
            flash("Wrong Password")
    return render_template('login.html', form=form)


@users.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('core.index'))

@users.route("/account", methods=['GET', 'POST'])
@login_required
def account():

    form = UpdateUserForm()
    profile_image = url_for('static', filename='profile_pics/' + current_user.profile_image)
    if form.validate_on_submit():
        if form.picture.data:
            username = current_user.username
            pic = add_profile_pic(form.picture.data,username)
            current_user.profile_image = pic

        # checking that other users don't have the requested email or username

        #if username already exist and not current user explain username is taken
        searched_user = User.query.filter_by(username=form.username.data).first()
        if searched_user and not searched_user.username==current_user.username:
            flash("This username is already taken")
            return redirect(url_for('users.account'))

        #if email already exist and not current user explain email is taken
        searched_user = User.query.filter_by(email=form.email.data).first()
        if searched_user and not searched_user.email==current_user.email:
            flash("This email is already taken")
            profile_image = url_for('static', filename='profile_pics/' + current_user.profile_image)
            return redirect(url_for('users.account'))


        current_user.username = form.username.data
        current_user.email = form.email.data

        db.session.commit()

        return redirect(url_for('users.account'))

    elif request.method == 'GET':
        form.username.data = current_user.username
        form.email.data = current_user.email

    profile_image = url_for('static', filename='profile_pics/' + current_user.profile_image)
    return render_template('account.html', profile_image=profile_image, form=form)

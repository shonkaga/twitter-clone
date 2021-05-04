from flask import render_template, url_for, flash, redirect, request, Blueprint
from flask_login import login_user, current_user, logout_user, login_required ,login_required
from components import db
from werkzeug.security import generate_password_hash,check_password_hash
from components.models import User, Post
from components.users.forms import RegistrationForm, LoginForm, UpdateUserForm
from components.users.picture_handler import add_profile_pic, add_post_pic
from components.posts.forms import WritePost

# setting the users blueprint
users = Blueprint('users', __name__)

@users.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()

    if form.validate_on_submit():

        user = User(email=form.email.data,
                    username=form.username.data,
                    name = form.name.data,
                    password=form.password.data)

        db.session.add(user)
        db.session.commit()
        return redirect(url_for('users.login'))
    return render_template('register.html', form=form)


@users.route('/login', methods=['GET', 'POST'])
def login():

    form = LoginForm()
    if form.validate_on_submit():
        # Grab the user from our User Models table

        user = User.query.filter_by(email=form.email.data).first()



        if user.check_password(form.password.data):
            #Log in the user

            login_user(user)
            flash('Logged in successfully.')


            next = request.args.get('next')


            if next == None or not next[0]=='/':
                next = url_for('core.index')

            return redirect(next)
        else:
            flash("Wrong Password")
    return render_template('login.html', form=form)


@users.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('core.index'))

@users.route("/account", methods=['GET', 'POST'])
@login_required
def account():

    account_form = UpdateUserForm()
    post_form = WritePost()
    profile_image = url_for('static', filename='profile_pics/' + current_user.profile_image)
    posts = current_user.posts

    # checking the account form
    if account_form.validate_on_submit():
        if account_form.picture.data:
            username = current_user.username
            pic = add_profile_pic(account_form.picture.data,username)
            current_user.profile_image = pic


        # checking that other users don't have the requested email or username

        #if username already exist and not current user explain username is taken
        searched_user = User.query.filter_by(username=account_form.username.data).first()
        if searched_user and not searched_user.username==current_user.username:
            flash("This username is already taken")
            return redirect(url_for('users.account'))

        #if email already exist and not current user explain email is taken
        searched_user = User.query.filter_by(email=account_form.email.data).first()
        if searched_user and not searched_user.email==current_user.email:
            flash("This email is already taken")
            profile_image = url_for('static', filename='profile_pics/' + current_user.profile_image)
            return redirect(url_for('users.account'))


        current_user.username = account_form.username.data
        current_user.email = account_form.email.data
        current_user.bio = account_form.bio.data

        db.session.commit()

        return redirect(url_for('users.account'))


    # Cheking the post form
    if post_form.validate_on_submit():

        text = post_form.text.data
        post = Post(user_id=current_user.id, text=text)
        db.session.add(post)
        db.session.commit()

        if post_form.picture.data:
            pic = add_post_pic(post_form.picture.data,post.id)
            post.image = pic
            db.session.add(post)
            db.session.commit()


        return redirect(url_for('users.account'))


    return render_template('user.html', profile_image=profile_image, account_form=account_form,post_form=post_form, user=current_user, posts=posts )


@users.route("/user/<username>",methods=['GET', 'POST'])
@login_required
def u(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        return render_template('error_pages/404.html'), 404
    else:
        # this means the user exists

        account_form = UpdateUserForm()
        post_form = WritePost()
        profile_image = url_for('static', filename='profile_pics/' + current_user.profile_image)
        posts = user.posts

        # checking the account form
        if account_form.validate_on_submit():
            if account_form.picture.data:
                username = current_user.username
                pic = add_profile_pic(account_form.picture.data,username)
                current_user.profile_image = pic


            # checking that other users don't have the requested email or username

            #if username already exist and not current user explain username is taken
            searched_user = User.query.filter_by(username=account_form.username.data).first()
            if searched_user and not searched_user.username==current_user.username:
                flash("This username is already taken")
                return redirect(url_for('users.account'))

            #if email already exist and not current user explain email is taken
            searched_user = User.query.filter_by(email=account_form.email.data).first()
            if searched_user and not searched_user.email==current_user.email:
                flash("This email is already taken")
                profile_image = url_for('static', filename='profile_pics/' + current_user.profile_image)
                return redirect(url_for('users.account'))


            current_user.username = account_form.username.data
            current_user.email = account_form.email.data
            current_user.bio = account_form.bio.data

            db.session.commit()

            return redirect(url_for('users.u',username=username))


        # Cheking the post form
        if post_form.validate_on_submit():

            text = post_form.text.data
            post = Post(user_id=current_user.id, text=text)
            db.session.add(post)
            db.session.commit()

            if post_form.picture.data:
                pic = add_post_pic(post_form.picture.data,post.id)
                post.image = pic
                db.session.add(post)
                db.session.commit()


            return redirect(url_for('users.u',username=username))


        return render_template('user.html', profile_image=profile_image, account_form=account_form,post_form=post_form, user=user, posts=posts )

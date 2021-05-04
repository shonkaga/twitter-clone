from flask import render_template,request,Blueprint,redirect, url_for
from components.models import User, Post
from components.posts.forms import WritePost
from flask_login import login_user, current_user, logout_user, login_required ,login_required
from components import db
from components.users.picture_handler import add_post_pic

core = Blueprint('core',__name__)

@core.route('/', methods=['GET', 'POST'])
@login_required
def index():
    posts = Post.query.order_by(Post.date.desc()).all()
    post_form = WritePost() # Need to validated the info and find a way to toggle the view if I need to redirect

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


        return redirect(url_for('core.index'))

    return render_template('index.html', posts=posts , post_form=post_form)

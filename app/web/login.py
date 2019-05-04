# -*- coding: utf-8 -*
from . import web
from flask import request, redirect, render_template,flash,url_for
from app.forms.login import LoginFrom
from app.models.models import User
from flask_login import login_user,login_required,logout_user


@web.route('/admin/login', methods=['GET', 'POST'])
def login():
      form = LoginFrom(request.form)
      if form.validate_on_submit():
         user = User.query.filter_by(email=form.email.data).first()
         if user is not None and user.check_password(form.password.data) and user.flag == 1:
            login_user(user)
            # flash('登录成功!欢迎回来,%s'% user.username,'success')
            return redirect(request.args.get('next') or url_for('Web.admin'))
         else:
            flash('登录失败!用户名或密码错误.','danger')
      if form.errors:
         flash(u'登陆失败，请尝试重新登陆.', 'danger')

      return render_template("auth/login.html",form=form)


@web.route('/admin/logout')
@login_required
def logout():
    logout_user()
    flash(u'已注销登录,点击末尾超链接可回前台。', 'success')
    return redirect(url_for('Web.login'))
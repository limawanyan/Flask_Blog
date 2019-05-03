# -*- coding: utf-8 -*
from . import web
from flask import request, redirect, render_template, session
from flask_login import login_required


@web.route('/admin/index', methods=['GET'])
@login_required
def admin():
   return render_template("admin/index.html")

@web.route('/admin/editblog', methods=['GET'])
@login_required
def editblog():
   return render_template("admin/editblog.html")
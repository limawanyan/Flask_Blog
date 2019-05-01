# -*- coding: utf-8 -*
# index 视图
from . import web
from flask import request, redirect, render_template, session
from app.models.models import BlogView

@web.route('/', methods=['GET', 'POST'])
def index():
   BlogView.add_view()
   return render_template("index.html")
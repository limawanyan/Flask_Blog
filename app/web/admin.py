# -*- coding: utf-8 -*
from . import web
from flask import request, redirect, render_template, session
from flask_login import login_required
import datetime
from Config import Config
import os
from app.libs import xjson
from app.models.models import ArticleClass
from app.view_models.articleclass import ArticleClassModel
import json

@web.route('/admin/index', methods=['GET'])
@login_required
def admin():
   return render_template("admin/index.html")

@web.route('/admin/editblog', methods=['GET'])
@login_required
def editblog():
   return render_template("admin/editblog.html")

@web.route('/admin/uploader', methods=['POST'])
@login_required
def logo_uploader():
   upload_file = request.files['file']
   file_suffix = (upload_file.filename).split('.')[-1]
   filename = datetime.datetime.now().strftime('%Y-%m-%d%H%M%S')+'.'+file_suffix
   upload_type = request.values.get("save_type")
   save_url = ""
   if upload_type == 'logo':
      save_url = Config.LOGO_DIR
   elif upload_type == 'blog':
      save_url = Config.BLOG_DIR
   else:
      return xjson.json_params_error('请求参数错误!')

   if not os.path.exists(save_url):
      os.makedirs(save_url)
   upload_file.save(save_url+filename)  # 保存到本地
   return xjson.json_success('上传成功',{'img':filename})

@web.route('/admin/api/getLogo', methods=['POST'])
@login_required
def getLogoUrl():
   files = os.listdir(Config.LOGO_DIR)  # 获取图片名称
   return xjson.json_success('获取成功!',data={'filename':files})

@web.route('/admin/api/getClass', methods=['POST'])
@login_required
def getClass():
   articleclass = ArticleClass.query.filter(ArticleClass.fid!=None,ArticleClass.hide==True).all()
   articleclass = [ json.dumps(ArticleClassModel(i).__dict__,ensure_ascii=False) for i in articleclass]
   return xjson.json_success('获取成功!',data={"class":articleclass})
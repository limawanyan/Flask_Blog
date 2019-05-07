# -*- coding: utf-8 -*
from . import web
from flask import request, redirect, render_template, session
from flask_login import login_required,login_manager
import datetime
from Config import Config
import os
from app.libs import xjson
from app.models.models import ArticleClass,Tag,db,Article
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

@web.route('/admin/api/saveBlog', methods=['POST'])
@login_required
def saveBlog():
   userid = login_manager._get_user().uid
   title = request.json.get("title",None)
   content = request.json.get("content",None)
   summary = request.json.get("summary",None)
   tags = request.json.get("tags", None)
   flag = request.json.get("flag", None)
   acid = request.json.get("acid", None)
   logo = request.json.get("logo", None)
   if not title and not content or not summary or not tags or not flag or not acid or not logo:
      return xjson.json_params_error('请求参数异常,核对是否有误?')
   tags_list = tags.split(";")
   # tags处理
   for index, i in enumerate(tags_list):
      if i != '':
         tag = Tag.query.filter(Tag.name == i).first()
         if not tag:
            newtag = Tag(i)
            db.session.add(newtag)
            db.session.commit()
            tags_list[index] = newtag
         else:
            tags_list[index] = tag

   article = Article(title,logo,userid,content,summary,acid,flag)
   for i in tags_list:
      article.tag.append(i)
   db.session.add(article)
   db.session.commit()

   return xjson.json_success("成功!")


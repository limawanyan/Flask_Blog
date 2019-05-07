# -*- coding: utf-8 -*
# index 视图
from . import web
from flask import request, redirect, render_template, session
from app.models.models import BlogView,Article,ArticleClass,db,Tag
from Config import Config

@web.route('/')
def index():
   BlogView.add_view()
   page = request.args.get('page',1,type=int)
   pagination = Article.query.filter(Article.flag==1).order_by(Article.create_time.desc()).paginate(
      page,Config.PAGE_ITEM_NUM,error_out=False)
   articles = pagination.items
   return render_template("index.html",articles=articles,pagination=pagination,endpoint='.index')

@web.route('/article-class/<int:id>/')
def articleClass(id):
   BlogView.add_view()
   page = request.args.get('page', 1, type=int)
   pagination = ArticleClass.query.get_or_404(id).articles.order_by(Article.create_time.desc()).paginate(
               page,Config.PAGE_ITEM_NUM,error_out=False)
   articles = pagination.items
   return render_template('index.html', articles=articles,
                              pagination=pagination, endpoint='.articleClass',
                              id=id)

@web.route('/article-details/<int:id>/')
def articleDetails(id):
    BlogView.add_view()
    article = Article.query.get_or_404(id)
    article.add_view(article)
    return render_template('article_details.html',article = article)

@web.route('/article-tag/<int:id>/')
def articleTag(id):
    BlogView.add_view()
    page = request.args.get('page', 1, type=int)
    pagination = Tag.query.get_or_404(id).articles.order_by(Article.create_time.desc()).paginate(
        page, Config.PAGE_ITEM_NUM, error_out=False)
    articles = pagination.items
    return render_template('index.html', articles=articles,
                           pagination=pagination, endpoint='.articleClass',
                           id=id)
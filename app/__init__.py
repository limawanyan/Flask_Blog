from flask import Flask
from app.models.models import db,BlogInfo,BlogView,User,ArticleClass
from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager
from flask_moment import Moment

csrf = CSRFProtect()
moment = Moment()
login_manager = LoginManager()

def create_app(Config):
    # 实例化Flask
    app = Flask(__name__)
    # 导入配置文件
    app.config.from_object(Config)

    register_blueprint(app)

    moment.init_app(app)

    csrf.init_app(app)

    login_manager.init_app(app)
    login_manager.session_protection = 'strong'
    login_manager.login_view = 'Web.login'
    login_manager.login_message = '请先登录哦!'

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.filter(User.uid == user_id).first()

    db.init_app(app)
    with app.app_context():
        # db.drop_all()
        db.create_all()
        # BlogInfo.insert_blog_info()
        # User.insert_admin('2388962411@qq.com','huzhipeng','123456')
        # ArticleClass.insert_class()
        # BlogView.insert_view()

    return app


def register_blueprint(app):
    ## 注册蓝图 ##
    # 导入蓝图
    from app.web import web

    #为flask_app 注册蓝图
    app.register_blueprint(web)
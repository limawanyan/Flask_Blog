import os

class Config:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///Blog.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    CSRF_ENABLED = True

    SECRET_KEY = "dfsdfdfd/*fdecea.;'sfra/.,ads"

    LOGO_DIR = os.path.join(os.path.abspath(os.path.dirname(__file__)),"app/static/upload/logo/")
    BLOG_DIR = os.path.join(os.path.abspath(os.path.dirname(__file__)), "app/static/upload/blog/")
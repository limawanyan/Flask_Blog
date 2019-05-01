class Config:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///Blog.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    CSRF_ENABLED = True

    SECRET_KEY = "dfsdfdfd/*fdecea.;'sfra/.,ads"
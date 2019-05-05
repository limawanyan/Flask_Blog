from sqlalchemy import String,Integer,Text,DateTime,ForeignKey,func
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# Article_Tag 多对多
article_tag = db.Table('article_Tag',
                    db.Column("article_id", Integer, ForeignKey("article.aid"), primary_key=True),
                    db.Column("tag_id", Integer, ForeignKey("tag.tid"), primary_key=True),
                    )


class User(db.Model,UserMixin):
    __tablename__ = 'users'
    uid = db.Column(Integer,primary_key=True)  # 用户id
    email = db.Column(String(50),nullable=False)  # 用户邮箱
    username = db.Column(String(20),nullable=False)  # 用户昵称
    _pwd = db.Column(String(200),nullable=False)  # 密码
    img = db.Column(String(200))  # 头像
    tel = db.Column(String(11))  # 电话
    flag = db.Column(Integer,default=1)  # 0 停用 1 正常

    article = db.relationship('Article', back_populates='user')

    @staticmethod
    def insert_admin(email, username, password):
        user = User(email=email, username=username, password=password)
        db.session.add(user)
        db.session.commit()

    @property
    def password(self):
        return self._pwd

    @password.setter
    def password(self, password):
        self._pwd = generate_password_hash(password)

    def check_password(self, password):
        resulf = check_password_hash(self._pwd, password)
        return resulf

    def get_id(self):
        try:
            return self.uid
        except AttributeError:
            raise NotImplementedError('No `id` attribute - override `get_id`')


class ArticleClass(db.Model):
    __tablename__ = 'articleclass'
    acid = db.Column(Integer,primary_key=True)  # 类别ID
    name = db.Column(String(20),nullable=False)  # 类别名称
    fid = db.Column(Integer,ForeignKey('articleclass.acid'))  # 父级分类编号
    order = db.Column(Integer,default=0)  # 排序
    hide = db.Column(db.Boolean,default=True)  # 是否隐藏

    article = db.relationship('Article', back_populates='aclass')

    @staticmethod
    def insert_class():
        default_class = {"数据库":['mysql','sqllit'],'Web开发':['JS','BootStrap'],'爱生活':['趣事分享','闲谈家常'],'其他':''}
        for i in default_class.keys():
            db.session.add(ArticleClass(name=i))
            if default_class[i]:
                for j in default_class[i]:
                    db.session.add(ArticleClass(name=j,fid=(ArticleClass.query.filter(ArticleClass.fid==None).order_by(ArticleClass.acid.desc()).first()).acid))
            db.session.commit()


class BlogInfo(db.Model):
    __tablename__ = 'bloginfo'
    id = db.Column(Integer, primary_key=True)  # id
    title = db.Column(db.String(64))  # 博客名称
    signature = db.Column(db.Text)  # 个性签名
    footsignature = db.Column(db.String(64))  # 底部文字

    @staticmethod
    def insert_blog_info():
        blog_mini_info = BlogInfo(title=u'爱奔跑的鹏',
                                  signature=u'愿你走出半生,初心仍在',
                                  footsignature=u'爱生活,爱学习!')
        db.session.add(blog_mini_info)
        db.session.commit()


class Article(db.Model):
    __tablename__ = 'article'
    aid = db.Column(Integer,primary_key=True, autoincrement=True)  # 文章编号
    title = db.Column(String(50))  # 标题
    logo_photo = db.Column(String(100)) #封面图
    uid = db.Column(Integer,ForeignKey("users.uid"))  # 发布者
    content = db.Column(Text, nullable=False)  # 文章内容
    summary = db.Column(db.Text)  # 摘要
    num_of_view = db.Column(Integer, default=0)  # 点击数量
    acid = db.Column(Integer, ForeignKey("articleclass.acid"), nullable=False)  # 所属类别
    create_time = db.Column(DateTime, default=func.now())  # 发布时间
    update_time = db.Column(DateTime, default=func.now(),onupdate=func.now)  # 最后修改时间
    flag = db.Column(Integer, default=1)  # 默认为1  0为垃圾/ 1为正常 / 2为草稿

    def __init__(self,title,logo_photo,uid,content,summary,acid,flag):
        self.title = title
        self.logo_photo = logo_photo
        self.uid = uid
        self.content = content
        self.summary = summary
        self.acid = acid
        self.flag =flag

    # 多对多,article and tag
    tag = db.relationship('Tag', secondary=article_tag, back_populates="article")
    # 多对一,user and article,class and article
    user = db.relationship('User', back_populates='article')
    aclass = db.relationship('ArticleClass',back_populates='article')
    comment = db.relationship('Comment', back_populates='article')


class Tag(db.Model):
    __tablename__ = "tag"
    tid = db.Column(Integer, primary_key=True, autoincrement=True)  # 标签编号
    name = db.Column(String(20), nullable=False)  # 标签名称

    def __init__(self, name):
        self.name = name

    article = db.relationship('Article', secondary=article_tag, back_populates="tag")


class Comment(db.Model):
    __tablename__ = "comment"
    cid = db.Column(Integer, primary_key=True, autoincrement=True)  # 评论编号
    aid = db.Column(Integer, ForeignKey("article.aid"))  # 所属文章
    fid = db.Column(Integer)  # 回复哪条评论id
    gid = db.Column(Integer)  # 属于哪个根节点
    text = db.Column(String(250), nullable=False)  # 评论内容
    username = db.Column(String(20),nullable=False)  # 昵称
    email = db.Column(String(60),nullable=False)  # 邮箱
    uptime = db.Column(DateTime, default=func.now())  # 回复时间
    flag = db.Column(Integer, default=1)  # 默认为1  0为隐藏 / 1为显示
    img = db.Column(String(200))  # 头像

    article = db.relationship('Article',back_populates='comment')

class BlogView(db.Model):
    __tablename__ = 'blog_view'
    id = db.Column(db.Integer, primary_key=True)
    num_of_view = db.Column(db.BigInteger, default=0)

    @staticmethod
    def insert_view():
        view = BlogView(num_of_view=0)
        db.session.add(view)
        db.session.commit()

    @staticmethod
    def add_view():
        view = BlogView.query.first()
        view.num_of_view += 1
        db.session.add(view)
        db.session.commit()

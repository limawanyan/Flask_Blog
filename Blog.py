from app import create_app
from Config import Config
from app.models.models import BlogInfo,ArticleClass,BlogView

if __name__ == '__main__':
    app = create_app(Config)
    # 全局对象
    app.add_template_global(BlogInfo,'BlogInfo')
    app.add_template_global(ArticleClass,'ArticleClass')
    app.add_template_global(len,'len')
    app.add_template_global(BlogView, 'BlogView')

    app.run()

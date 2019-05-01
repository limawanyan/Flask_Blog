from flask_wtf import FlaskForm
from wtforms import StringField,PasswordField
from wtforms.validators import DataRequired,Length,Email


class LoginFrom(FlaskForm):
    email = StringField(validators=[DataRequired(),Length(8,64),Email(message='电子邮箱不符合规范')])
    password = PasswordField(validators=[DataRequired(message='密码长度至少6位!'),Length(6,32)])
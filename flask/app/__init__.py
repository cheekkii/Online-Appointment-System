import os
from flask import Flask, request, redirect
from werkzeug.debug import DebuggedApplication
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_mail import Mail, Message
from flask_wtf.csrf import CSRFProtect
from authlib.integrations.flask_client import OAuth

app = Flask(__name__, static_folder='static')
app.url_map.strict_slashes = False

app.jinja_options = app.jinja_options.copy()
app.jinja_options.update({
    'trim_blocks': True,
    'lstrip_blocks': True
})

app.config['DEBUG'] = True
app.config['SECRET_KEY'] = \
    '2cdf2f9c15bdeea8a17e855ecdca78c99c0d8a3695366c18'

app.config['JSON_AS_ASCII'] = False

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL", "sqlite://")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Flask-Mail Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Gmail SMTP server
app.config['MAIL_PORT'] = 587  # TLS port
app.config['MAIL_USE_TLS'] = True  # Use TLS
app.config['MAIL_USE_SSL'] = False  # Do not use SSL (Use either SSL or TLS, not both)
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME") # Your Gmail address
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")  # Your Gmail App Password (Not your normal password!)
app.config['MAIL_DEFAULT_SENDER'] = os.getenv("MAIL_USERNAME")  # Default sender

mail = Mail(app)  # Initialize Flask-Mail

#Google OAuth
app.config['GOOGLE_CLIENT_ID'] = os.getenv("GOOGLE_CLIENT_ID", None)
app.config['GOOGLE_CLIENT_SECRET'] = os.getenv("GOOGLE_CLIENT_SECRET", None)
app.config['GOOGLE_DISCOVERY_URL'] = os.getenv("GOOGLE_DISCOVERY_URL", None)

#GitHub OAuth
app.config['GITHUB_CLIENT_ID'] = os.getenv("GITHUB_CLIENT_ID")
app.config['GITHUB_CLIENT_SECRET'] = os.getenv("GITHUB_CLIENT_SECRET")
app.config['GITHUB_AUTHORIZE_URL'] = "https://github.com/login/oauth/authorize"
app.config['GITHUB_ACCESS_TOKEN_URL'] = "https://github.com/login/oauth/access_token"

# for CSRF
csrf = CSRFProtect(app)
csrf.init_app(app)

if app.debug:
    app.wsgi_app = DebuggedApplication(app.wsgi_app, evalex=True)

# Creating an SQLAlchemy instance
db = SQLAlchemy(app)
oauth = OAuth(app)

login_manager = LoginManager()
login_manager.login_view = 'login_page'
login_manager.init_app(app)

@app.before_request
def remove_trailing_slash():
    # Check if the path ends with a slash but is not the root "/"
    if request.path != '/' and request.path.endswith('/'):
        # Redirect to the same URL without the trailing slash
        return redirect(request.path[:-1], code=301)

from app import views #noqa
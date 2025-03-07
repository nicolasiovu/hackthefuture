from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import timedelta
from flask_jwt_extended import JWTManager

app= Flask(__name__)
CORS(app)
jwt = JWTManager()
db = SQLAlchemy()

app.config['SECRET_KEY'] = "asdfasfsahofh hksdklghksl"
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///mydatabase.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

db.init_app(app)
jwt.init_app(app)

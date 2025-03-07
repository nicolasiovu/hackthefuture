from config import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


class Client(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    brand_name = db.Column(db.String(80), unique=True, nullable=False)
    username = db.Column(db.String(150), unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    api_link = db.Column(db.String(255), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_json(self):
        return {
            'id': self.id,
            'brand_name': self.brand_name,
            'api_link': self.api_link
        }


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    date = db.Column(db.String(10), nullable=False)
    item_name = db.Column(db.String(255), nullable=False)
    reason = db.Column(db.String(100), nullable=False)
    verdict = db.Column(db.String(100), nullable=False)

    def to_json(self):
        return {
            'id': self.id,
            'client_id': self.client_id,
            'date': self.date,
            'item_name': self.item_name,
            'reason': self.reason,
            'verdict': self.verdict
        }
    

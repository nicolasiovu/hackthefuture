import pandas as pd

from config import db, app
import kagglehub
from kagglehub import KaggleDatasetAdapter
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
    order_id = db.Column(db.String, primary_key=True)
    order_date = db.Column(db.Date, nullable=False)
    ship_mode = db.Column(db.String(50), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    postal_code = db.Column(db.Integer, nullable=False)
    product_id = db.Column(db.String(255), nullable=False)
    product_category = db.Column(db.String(100), nullable=False)
    product_subcategory = db.Column(db.String(100), nullable=False)
    product_name = db.Column(db.String(255), nullable=False)
    product_price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    returned = db.Column(db.Integer, nullable=False)

    def to_json(self):
        return {
            'order_id': self.order_id,
            'order_date': self.order_date,
            'ship_mode': self.ship_mode,
            'customer_id': self.customer_id,
            'country': self.country,
            'city': self.city,
            'state': self.state,
            'postal_code': self.postal_code,
            'product_id': self.product_id,
            'product_category': self.product_category,
            'product_subcategory': self.product_subcategory,
            'product_name': self.product_name,
            'product_price': self.product_price,
            'quantity': self.quantity,
            'returned': self.returned,
        }

def upload_data_to_db():

    con = app.config['SQLALCHEMY_DATABASE_URI']
    ds_path = kagglehub.dataset_download("abdulqaderasiirii/e-commerce-data")
    file_path = f"{ds_path}/E-commerce.xlsx"
    df = pd.read_excel(file_path, sheet_name="Orders")
    df_orders = df.copy()
    df_orders.drop(["Row ID", "Customer Name", "Segment", "Region", "Discount", "Profit"], axis=1, inplace=True)

    df_returns = pd.read_excel(file_path, sheet_name="Returns")

    df_orders["Returned"] = df_orders["Order ID"].isin(df_returns["Order ID"]).astype(int)
    df_orders = df_orders.drop_duplicates(subset=['Order ID'])

    # print(df_orders["Order ID"].duplicated().sum())

    for _, row in df_orders.iterrows():
        record = Order(order_id=row["Order ID"], order_date=row["Order Date"], ship_mode=row["Ship Mode"],
                       customer_id=row["Customer ID"], country=row["Country"], city=row["City"],
                       state=row["State"], postal_code=row["Postal Code"], product_id=row["Product ID"],
                       product_category=row["Category"], product_subcategory=row["Sub-Category"],
                       product_name=row["Product Name"], product_price=row["Sales"], quantity=row["Quantity"],
                       returned=row["Returned"])
        existing = db.session.query(Order).filter_by(order_id=row["Order ID"]).first()
        if existing is None:
            db.session.add(record)
        db.session.commit()




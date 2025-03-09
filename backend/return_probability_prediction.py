import pandas as pd
from flask import jsonify
from tensorflow import keras
import joblib

from models import Order

def predict_return(deets: Order):
    order_dict = {column.name: getattr(deets, column.name) for column in Order.__table__.columns}
    model = keras.models.load_model("return_prediction_model_v2.keras")
    preprocessor = joblib.load("return_prediction_preprocessor_v2.joblib")

    df = pd.DataFrame([order_dict])
    df['Order Date'] = pd.to_datetime(df['Order Date'])
    df['Year'] = df['Order Date'].dt.year
    df['Month'] = df['Order Date'].dt.month
    df['Day'] = df['Order Date'].dt.day
    df['Day_of_Week'] = df['Order Date'].dt.dayofweek
    df.drop(["Order Date"], axis=1, inplace=True)
    input = preprocessor(df)

    probability = model.predict(input)[0][0]

    return jsonify({"Probability": float(probability)})



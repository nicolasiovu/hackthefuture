from flask import request, jsonify
from config import app, db
from models import Client, Order, Request, upload_data_to_db
from datetime import datetime, timedelta, timezone
import json
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity, unset_jwt_cookies
from collections import Counter
from google import genai
import time
from google.genai import types
import os

API_KEY = "AIzaSyC-XukHCg6_neZVFz6fQyejY6F1m-fSM30"
client = genai.Client(api_key=API_KEY)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route('/register', methods=['POST'])
def register():
    brand_name = request.json.get('brand_name')
    api_link = request.json.get('api_link')
    username = request.json.get('username')
    password1 = request.json.get('password1')
    password2 = request.json.get('password2')

    user = Client.query.filter_by(username=username).first()
    if user:
        return jsonify({"message": "User already exists"}), 404
    elif len(username) < 4:
        return jsonify({"message": "Username must be greater than 3 characters"}), 404
    elif password1 != password2:
        return jsonify({"message": "'Passwords don\'t match"}), 403
    elif len(password1) < 7:
        return jsonify({"message": "'Password must be at least 7 characters"}), 403
    elif Client.query.filter_by(brand_name=brand_name).first():
        return jsonify({"message": "Client already registered"}), 402
    elif not api_link:
        return jsonify({"message": "Your API link must be provided"}), 401

    new_client = Client(username=username, brand_name=brand_name, api_link=api_link)
    new_client.set_password(password1)
    try:
        db.session.add(new_client)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 400
    return jsonify({'message': 'Client created!'}), 201

@app.route('/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    if not username or not password:
        return jsonify({"message": "Empty input"}), 401
    user = Client.query.filter_by(username=username).one_or_none()
    if user and user.check_password(password):
        access_token = create_access_token(identity={'id': user.id})
        return jsonify({"access_token": access_token}), 200
    return jsonify({"message": "Incorrect username or password."}), 401

@app.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@app.route('/update_password/<int:user_id>', methods=['PATCH'])
@jwt_required()
def update_password(user_id):
    old_password = request.json['oldPassword']
    password1 = request.json['password1']
    password2 = request.json['password2']

    user = Client.query.get(user_id)
    if not user:
        return jsonify({"message": "Client not found."}), 404
    elif not user.check_password(old_password):
        return jsonify({"message": "Incorrect old password."}), 400
    elif password1 != password2:
        return jsonify({"message": "New passwords do not match."}), 400
    elif len(password1) < 7:
        return jsonify({"message": "Password must be at least 7 characters."}), 400
    user.set_password(password1)
    db.session.commit()
    return jsonify({"message": "Password updated!"}), 200

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data['access_token'] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        return response

@app.route('/get_user', methods=['GET'])
@jwt_required()
def get_user():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@app.route('/get_daily_volume', methods=['GET'])
@jwt_required()
def get_daily_volume():
    current_client = get_jwt_identity()
    id = current_client["id"]
    date = datetime.today().strftime('%Y-%m-%d')
    orders = Order.query.filter_by(customer_id=id, order_date=date).all()
    return jsonify({"daily_volume": len(orders)}), 200


def calculate_percentages(lst):
    """Calculate the percentage of occurrences of each item in a list."""
    if not lst:
        return {}

    counts = Counter(lst)
    total = len(lst)
    return {str(key): round((value / total) * 100) for key, value in counts.items()}

def top_4_occurrences(input_list: list):
    # Count the occurrences of each string in the list
    counter = Counter(input_list)

    # Get the top 4 most common elements with their counts
    top_4 = counter.most_common(4)

    # Format the output as requested
    formatted_output = [
            {"id": i + 1, "name": name, "occurrences": count}
            for i, (name, count) in enumerate(top_4)
        ]

    return formatted_output

@app.route('/dashboard_stats', methods=['GET'])
@jwt_required()
def dashboard_stats():
    """Fetch dashboard statistics and return JSON response."""

    try:
        # Get the current authenticated user
        current_user = get_jwt_identity()
        if not current_user:
            return jsonify({"msg": "Unauthorized"}), 401

        # Get today's date
        date = datetime.today().strftime('%Y-%m-%d')

        # Get today's requests & accepted returns
        requests_today = Request.query.filter_by(request_date=date).count() or 0
        returns_accepted_today = Request.query.filter_by(return_accepted=1, request_date=date).count() or 0

        # Get return reasons and product names
        return_reasons = [str(reason) for reason in Request.query.with_entities(Request.return_reason).scalars().all() if reason]
        product_names = [str(name) for name in Request.query.with_entities(Request.product_name).scalars().all() if name]

        # Get top 4 most returned products
        top_4_returns = top_4_occurrences(product_names)

        # Fetch sales data for top products
        top_products_returned = []
        for product in top_4_returns:
            product_name = product["name"]
            sales_count = Order.query.filter_by(product_name=product_name).count() or 0

            # Avoid division by zero
            percentage = round((product["occurrences"] / sales_count) * 100) if sales_count > 0 else 0

            top_products_returned.append({
                "id": product["id"],
                "name": product_name,
                "percentage": percentage,
                "sales": sales_count
            })

        # Construct the JSON response
        response = {
            "requests_today": requests_today,
            "returns_accepted_today": returns_accepted_today,
            "reasons_for_returns": calculate_percentages(return_reasons) or {},
            "top_products_returned": top_products_returned
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

def _rank_condition_vid(file_paths):
  system_prompt="""
  You are an expert product condition evaluator whose job is to evaluate a
  returned item's condition and categorize it into one of the following: "Like
  New", "Slightly Used", "Used", "Damaged", "Severely Damaged". Respond with the
  category only and nothing else.
  """

  MODEL_ID = "gemini-2.0-flash"
  response = client.models.generate_content(
    model=f"models/{MODEL_ID}",
    contents=["Please evaluate the condition of this returned product and" +
              "categorize it into one of the 5 specified categories.", file_paths[0]],
    config=types.GenerateContentConfig(system_instruction=system_prompt,),
  )

  condition = response.text

  return condition


@app.route('/ask_gemini', methods=['POST'])
def ask_gemini():
  if "files" not in request.files:
    return jsonify({"error": "No file part"}), 400
  
  order_id = request.json['order_id']
  customer_id = request.json['client_id']
  reason = request.json['reason']

  uploaded_files = request.files.getlist("files")  # Get multiple files
  saved_file_paths = []

  for file in uploaded_files:
    if file.filename == "":
      return jsonify({"error": "No selected file"}), 400
        
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(file_path)
    saved_file_paths.append(file_path)

  condition = _rank_condition_vid(saved_file_paths)
  price = Order.query.filter_by(order_id=order_id).first().product_price

  return_order = None
  json = None

  date = datetime.today().strftime('%Y-%m-%d')

  if condition == "Like New" or condition == "Slightly Used":

    if reason == "Wrong Size":
      return_order = Request(order_id=order_id, customer_id=customer_id, product_condition=condition, request_date=date,
                             requst_accepted=1, return_reason=reason)

      json = jsonify({"Status": "Approved", "Refund": price}), 200

    elif reason in ["Wrong Item", "Item not as described",
                    "Not Satisfied", "Dont Want Item Anymore"]:

      return_order = Request(order_id=order_id, customer_id=customer_id, product_condition=condition, request_date=date,
                             requst_accepted=1, return_reason=reason)
      json = jsonify({"Status": "Approved", "Refund": price}), 200

    elif reason in ["Defective or Damaged", "Missing Parts or Accessories"]:

      return_order = Request(order_id=order_id, customer_id=customer_id, product_condition=condition, request_date=date,
                             requst_accepted=1, return_reason=reason)
      
      json = jsonify({"Status": "Approved", "Refund": price}), 200

  elif condition == "Used":


    if reason == "Wrong Size":

      return_order = Request(order_id=order_id, customer_id=customer_id, product_condition=condition, request_date=date,
                             requst_accepted=1, return_reason=reason)

      json = jsonify({"Status": "Approved", "Refund": price*0.7}), 200

    elif reason in ["Wrong Item", "Item not as described",
                    "Not Satisfied", "Dont Want Item Anymore"]:

      return_order = Request(order_id=order_id, customer_id=customer_id, product_condition=condition, request_date=date,
                             requst_accepted=1, return_reason=reason)

      json = jsonify({"Status": "Approved", "Refund": price*0.8}), 200

    elif reason in ["Defective or Damaged", "Missing Parts or Accessories"]:

      return_order = Request(order_id=order_id, customer_id=customer_id, product_condition=condition, request_date=date,
                             requst_accepted=0, return_reason=reason)

      json = jsonify({"Status": "Denied", "Reason": "Damaged by Customer"}), 200

  elif condition == "Damaged" or condition == "Severely Damaged":

    if reason == "Defective or Damaged":
      return_order = Request(order_id=order_id, customer_id=customer_id, product_condition=condition, request_date=date,
                             requst_accepted=1, return_reason=reason)

      json = jsonify({"Status": "Approved", "Refund": price}), 200
    else:
      return_order = Request(order_id=order_id, customer_id=customer_id, product_condition=condition, request_date=date,
                             requst_accepted=0, return_reason=reason)

      json = jsonify({"Status": "Denied", "Reason": "Damaged by Customer"}), 200

  db.session.add(return_order)
  db.session.commit()

  return json


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        # upload_data_to_db()

    app.run(debug=True)

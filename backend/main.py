from flask import request, jsonify
from config import app, db
from models import Client, Order, Request, upload_data_to_db
from datetime import datetime, timedelta, timezone
import json
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity, unset_jwt_cookies
from collections import Counter

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
    if not lst:
        return {}

    counts = {}
    for item in lst:
        counts[item] = counts.get(item, 0) + 1

    total = len(lst)
    result = {}
    for key, value in counts.items():
        percent = round((value / total) * 100)
        result[key] = percent

    return result


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
    date = datetime.today().strftime('%Y-%m-%d')
    requests = len(Request.query.filter_by(request_date=date).all())
    returns = len(Request.query.filter_by(return_accepted=1, request_date=date).all())

    product_decision = Request.query.with_entities(Request.return_reason).scalars().all()

    product_name = Request.query.with_entities(Request.product_name).scalars().all()
    top_4_returns = top_4_occurrences(product_name)

    top_1 = len(Order.query.filter_by(product_name=top_4_returns[0]["name"]).all())
    top_2 = len(Order.query.filter_by(product_name=top_4_returns[1]["name"]).all())
    top_3 = len(Order.query.filter_by(product_name=top_4_returns[2]["name"]).all())
    top_4 = len(Order.query.filter_by(product_name=top_4_returns[3]["name"]).all())

    top_products_returned = [{"id": 1, "name": top_4_returns[0]["name"], "percentage": round((top_4_returns[0]["occurrences"]/top_1)*100), "Sales": top_1},
                             {"id": 2, "name": top_4_returns[1]["name"], "percentage": round((top_4_returns[1]["occurrences"]/top_2)*100), "Sales": top_2},
                             {"id": 3, "name": top_4_returns[2]["name"], "percentage": round((top_4_returns[2]["occurrences"]/top_3)*100), "Sales": top_3},
                             {"id": 4, "name": top_4_returns[3]["name"], "percentage": round((top_4_returns[3]["occurrences"]/top_4)*100), "Sales": top_4}
                             ]

    return jsonify({"Requests_today": requests,                                     # int
                    "Returns_accepted_today": returns,                              # int
                    "Reasons_for_returns": calculate_percentages(product_decision), #dict(string, int)
                    "Top_products_returned": top_products_returned}), 200           #list(dict)




# TODO: Add routes for checking if a return request is valid, and handling it appropriately


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        upload_data_to_db()

    app.run(debug=True)

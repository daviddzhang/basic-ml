from flask import Blueprint, request, jsonify
from sklearn.linear_model import Ridge
from sklearn.preprocessing import PolynomialFeatures

from app.ml_utils.data import *

bp = Blueprint("lin_regression", __name__)

DEFAULT_NUMEXAMPLES = 40
DEFAULT_DEGREE = 2

# route for choosing pre set data in db

@bp.route('/api/linreg/generate', methods=['GET'])
def generate_lin_reg_data():
    degree = request.args.get('degree', default=DEFAULT_DEGREE, type=int)
    num_examples = request.args.get('numExamples', default=DEFAULT_NUMEXAMPLES, type=int)

    try:
        data = generate_data_json(num_examples, degree)
        return jsonify(data)
    except ValueError as e:
        return str(e), 400



@bp.route('/api/linreg/fit', methods=['POST'])
def fit_data():
    data = request.json

    try:
        points, num_features, lambda_val = get_params_from_json(data)
        model = Ridge(alpha=lambda_val)

        x_vals, y_vals = point_array_to_x_y(points)
        x_vals = PolynomialFeatures(degree=num_features).fit_transform(x_vals)

        model.fit(x_vals, y_vals)

        response = {}

        response["coefficients"] = model.coef_.tolist()[0]

        return jsonify(response)
    except ValueError as e:
        return str(e), 400

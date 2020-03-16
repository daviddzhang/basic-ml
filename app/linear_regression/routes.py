from flask import Blueprint, request, jsonify
from sklearn.linear_model import Ridge
import numpy as np
from app.ml_utils import generate_data
from sklearn.preprocessing import PolynomialFeatures

bp = Blueprint("lin_regression", __name__)

DEFAULT_NUMEXAMPLES = 40
DEFAULT_DEGREE = 2

@bp.route('/api/linreg/generate', methods=['GET'])
def generate_lin_reg_data():
    degree = request.args.get('degree', default=DEFAULT_DEGREE, type=int)
    num_examples = request.args.get('numExamples', default=DEFAULT_NUMEXAMPLES, type=int)

    try:
        data = generate_data(num_examples, degree)
        return jsonify(data)
    except ValueError as e:
        return str(e), 400



@bp.route('/api/linreg/fit', methods=['POST'])
def fit_data():
    data = request.json
    points = data.get("train")
    num_features = data.get("num_features", 1)
    if num_features <= 0:
        return b"Number of features must be positive", 400
    alpha = data.get("alpha", 1)
    if alpha < 0:
        return b"alpha must be non-negative", 400
    model = Ridge(alpha=alpha)

    x_vals = np.array(list(points.keys()))
    x_vals = x_vals[:, np.newaxis]

    y_vals = np.array(list(points.values()))
    y_vals = y_vals[:, np.newaxis]

    x_vals = PolynomialFeatures(degree=num_features).fit_transform(x_vals)

    model.fit(x_vals, y_vals)

    response = {}

    response["coefficients"] = model.coef_.tolist()[0]

    return jsonify(response)

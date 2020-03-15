from flask import Blueprint, request, jsonify
from sklearn.linear_model import Ridge
import numpy as np

bp = Blueprint("lin_regression", __name__)

DEFAULT_NUMEXAMPLES = 40
DEFAULT_DEGREE = 2

@bp.route('/api/lreg/generate', methods=['GET'])
def generate_data_by_degree():
    degree = request.args.get('degree', default=DEFAULT_DEGREE, type=int)
    num_examples = request.args.get('numExamples', default=DEFAULT_NUMEXAMPLES, type=int)
    if degree < 0 or num_examples < 0:
        return "No negative parameters are allowed", 400

    x_vals = np.random.uniform(-2, 2, num_examples)
    y_vals = _generate_y_vals(x_vals, degree)
    response = {}
    for x, y in zip(x_vals, y_vals):
        response[x] = y

    return jsonify(response)

def _generate_y_vals(xVals, degree, random=np.random):
    coefficients = random.normal(0, 6, degree)
    res = np.zeros(xVals.size)
    for i in range(degree):
        res = res + coefficients[i] * np.power(xVals, i + 1)

    # add some noise to data:
    # scale noise standard deviation based on magnitude of coefficients - this is to decrease the change of
    # too much noise getting added
    std_dev_scale = np.sum(np.absolute(coefficients))
    return res + random.normal(0, std_dev_scale / 2, xVals.size)

@bp.route('api/lreg/fit', methods=['POST'])
def fit_data():
    return ''



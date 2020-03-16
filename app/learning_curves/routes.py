from flask import Blueprint, request, jsonify
from sklearn.linear_model import Ridge
import numpy as np
from app.ml_utils import generate_data
from sklearn.preprocessing import PolynomialFeatures

bp = Blueprint("learning_curves", __name__)

DEFAULT_DEGREE = 1
LEARNING_CURVE_NUM_EXAMPLES = 2000

@bp.route('/api/lcurve/generate', methods=['GET'])
def generate_learning_curve_data():
    degree = request.args.get('degree', default=DEFAULT_DEGREE, type=int)

    try:
        data = generate_data(LEARNING_CURVE_NUM_EXAMPLES, degree)
        return jsonify(data)
    except ValueError as e:
        return str(e), 400
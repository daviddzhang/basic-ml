from flask import Blueprint, request, jsonify
from sklearn.linear_model import Ridge
from sklearn.model_selection import learning_curve
import numpy as np
from app.ml_utils.data import *
from sklearn.preprocessing import PolynomialFeatures
import matplotlib.pyplot as plt

bp = Blueprint("learning_curves", __name__)

DEFAULT_DEGREE = 1
LEARNING_CURVE_NUM_EXAMPLES = 2000
TRAINING_SIZES = [1, 100, 250, 500, 750, 1000, 1300, 1600]

# route for choosing pre set data in db

@bp.route('/api/lcurve/data', methods=['GET'])
def generate_learning_curve_data():
    degree = request.args.get('degree', default=DEFAULT_DEGREE, type=int)

    try:
        data = generate_data(LEARNING_CURVE_NUM_EXAMPLES, degree)
        return jsonify(data)
    except ValueError as e:
        return str(e), 400


@bp.route('/api/lcurve/create', methods=['POST'])
def create_learning_curve():
    payload = request.json

    try:
        data, num_features, alpha = get_params_from_json(payload)

        x, y = dictionary_to_x_y(data)
        model = Ridge(alpha)
        print(x)
        print(y)

        train_sizes, train_scores, cv_scores = learning_curve(estimator=model, X=x, y=y, train_sizes=TRAINING_SIZES,
                                                              cv=5, scoring="neg_mean_squared_error")

        # sklearn uses 5 folds by default, so we must average out the error scores. we also need to take negative of the
        # scores due to using negative MSE
        train_scores_final = -train_scores.mean(axis=1)
        cv_scores_final = -cv_scores.mean(axis=1)

        plt.plot(train_sizes, train_scores_final, label='Training error')
        plt.plot(train_sizes, cv_scores_final, label='Validation error')

        response = {}

        response["training_score"] = train_scores_final.tolist()
        response["cv_score"] = cv_scores_final.tolist()

        return jsonify(response)
    except ValueError as e:
        return str(e), 400


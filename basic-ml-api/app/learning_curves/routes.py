from flask import Blueprint, request, jsonify
from sklearn.linear_model import Ridge
from sklearn.model_selection import learning_curve
from sklearn.preprocessing import PolynomialFeatures

from app.ml_utils.data import *

bp = Blueprint("learning_curves", __name__)

DEFAULT_DEGREE = 1
LEARNING_CURVE_NUM_EXAMPLES = 2000
TRAINING_SIZES = [1, 250, 500, 750, 1250, 1600]

@bp.route('/api/lcurve/data', methods=['GET'])
def generate_learning_curve_data():
    degree = request.args.get('degree', default=DEFAULT_DEGREE, type=int)

    try:
        data = generate_data_json(LEARNING_CURVE_NUM_EXAMPLES, degree)
        return jsonify(data)
    except ValueError as e:
        return str(e), 400


@bp.route('/api/lcurve/create', methods=['POST'])
def create_learning_curve():
    payload = request.json

    try:
        data, num_features, alpha = get_params_from_json(payload)

        x, y = point_array_to_x_y(data)
        model = Ridge(alpha)

        x = PolynomialFeatures(degree=num_features).fit_transform(x)

        train_sizes, train_scores, cv_scores = learning_curve(estimator=model, X=x, y=y, train_sizes=TRAINING_SIZES,
                                                              shuffle=True, scoring="neg_mean_squared_error")

        # sklearn uses 5 folds by default, so we must average out the error scores. we also need to take negative of the
        # scores due to using negative MSE
        train_scores_final = -train_scores.mean(axis=1)
        cv_scores_final = -cv_scores.mean(axis=1)

        response = {}

        response["training_score"] = train_scores_final.tolist()
        response["cv_score"] = cv_scores_final.tolist()

        return jsonify(response)
    except ValueError as e:
        return str(e), 400


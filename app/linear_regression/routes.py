from flask import Blueprint, request, jsonify
from sklearn.linear_model import Ridge
import numpy as np
from sklearn.preprocessing import PolynomialFeatures

bp = Blueprint("lin_regression", __name__)

DEFAULT_NUMEXAMPLES = 40
DEFAULT_DEGREE = 2


@bp.route('/api/linreg/generate', methods=['GET'])
def generate_data_by_degree():
    degree = request.args.get('degree', default=DEFAULT_DEGREE, type=int)
    num_examples = request.args.get('numExamples', default=DEFAULT_NUMEXAMPLES, type=int)
    if degree < 0 or num_examples < 0:
        return "No negative parameters are allowed", 400

    # generate specified num_examples, and 50% more for CV set
    x_vals = np.random.uniform(-2, 2, int(num_examples * 1.5))
    y_vals = _generate_y_vals(x_vals, degree)

    train_x = x_vals[:num_examples]
    train_y = y_vals[:num_examples]

    training = {}
    for x, y in zip(train_x, train_y):
        training[x] = y

    cv_x = x_vals[num_examples:]
    cv_y = y_vals[num_examples:]

    cv = {}
    for x, y in zip(cv_x, cv_y):
        cv[x] = y

    response = {"train": training, "cv": cv}
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

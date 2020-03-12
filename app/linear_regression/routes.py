from flask import Blueprint, request, jsonify
from sklearn.linear_model import Ridge
import numpy as np

bp = Blueprint("lin_regression", __name__)


@bp.route('/api/lreg/generate', methods=['GET'])
def generateDataByDegree():
    degree = request.args.get('degree', default=2, type=int)
    numExamples = request.args.get('numExamples', default=50, type=int)
    xVals = np.random.uniform(-25, 25, numExamples)
    yVals = _generateYVals(xVals, degree)
    response = {}
    for x, y in zip(xVals, yVals):
        dict[x] = y

    return jsonify(response)

def _generateYVals(xVals, degree):
    # add one since we want to generate a random y-intercept as well
    coefficients = np.random.uniform(-10, 10, degree + 1)
    res = np.zeros(xVals.size)
    for i in range(degree + 1):
        res = res + coefficients[i] * np.power(xVals, i)

    return res



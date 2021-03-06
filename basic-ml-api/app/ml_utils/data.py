import numpy as np

def generate_data_json(num_examples, degree, random=np.random):
    if degree < 0 or num_examples < 0:
        raise ValueError("No negative parameters are allowed")

    x_vals = random.uniform(-2, 2, num_examples)
    y_vals = _generate_y_vals(x_vals, degree)

    data = [[x, y] for (x,y) in zip(x_vals, y_vals)]

    res = {"data": data}
    return res


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

def get_params_from_json(payload):
    points = payload.get("data")
    num_features = payload.get("num_features", 1)
    if num_features <= 0:
        raise ValueError("Number of features must be positive")
    lambda_val = payload.get("lambda", 1)
    if lambda_val < 0:
        raise ValueError("lambda must be non-negative")

    return points, num_features, lambda_val


def point_array_to_x_y(data):
    data_length = len(data)
    x_vals = np.empty(data_length, float)
    y_vals = np.empty(data_length, float)

    for i in range(len(data)):
        x_vals[i] = data[i][0]
        y_vals[i] = data[i][1]

    y_vals = y_vals[:, np.newaxis]
    x_vals = x_vals[:, np.newaxis]

    return x_vals, y_vals
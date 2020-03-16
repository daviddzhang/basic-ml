import numpy as np

def generate_data(num_examples, degree, random=np.random):
    if degree < 0 or num_examples < 0:
        raise ValueError("No negative parameters are allowed")

    x_vals = random.uniform(-2, 2, num_examples)
    y_vals = _generate_y_vals(x_vals, degree)

    data = {}
    for x, y in zip(x_vals, y_vals):
        data[x] = y

    return data


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


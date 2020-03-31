from app.linear_regression.routes import DEFAULT_NUMEXAMPLES
from flask import json

SAMPLE_X_VALS = [-1.4690123930307815, -1.287124283110439, -1.2125632185980892, -1.194005738523089, -0.8896311703524478,
                 -0.12268708743189949, -0.03036546291118203, 0.14891200621134537, 1.7428125304256077,
                 1.8128017021409413]
SAMPLE_Y_VALS = [-152.11080949672981, -76.31498830804236, -77.68375975785183, -62.0486173799377, -1.5802228853887037,
                 30.95931653610449, -3.49784423837079, 3.091768316191677, 119.06189810921087, 170.36012988362484]


def test_generate_data_default_size(client):
    rv = client.get('/api/linreg/generate')
    json_res = rv.get_json()

    assert len(json_res) == DEFAULT_NUMEXAMPLES


def test_generate_data_custom_size(client):
    rv = client.get('/api/linreg/generate?numExamples=200')
    json_res = rv.get_json()

    assert len(json_res) == 200


# hard to test whether degree works via unit tests - was done manually
def test_generate_data_degree_no_impact(client):
    rv = client.get('/api/linreg/generate?degree=3&numExamples=200')
    json_res = rv.get_json()

    assert len(json_res) == 200


def test_bad_request_negative_degree(client):
    rv = client.get('/api/linreg/generate?degree=-1')
    assert rv.data == b"No negative parameters are allowed"


def test_bad_request_negative_numexamples(client):
    rv = client.get('/api/linreg/generate?numExamples=-2')
    assert rv.data == b"No negative parameters are allowed"


def test_bad_request_negative_params(client):
    rv = client.get('/api/linreg/generate?degree=-10&numExamples=-2')
    assert rv.data == b"No negative parameters are allowed"


def test_fit_default(client):
    points = {}
    for x, y in zip(SAMPLE_X_VALS, SAMPLE_Y_VALS):
        points[x] = y

    payload = {}
    payload["data"] = points

    rv = client.post('/api/linreg/fit', data=json.dumps(payload),
                     content_type='application/json')
    resp_json = rv.get_json()
    coefficients = resp_json["coefficients"]

    assert len(coefficients) == 2


def test_fit_num_features(client):
    points = {}
    for x, y in zip(SAMPLE_X_VALS, SAMPLE_Y_VALS):
        points[x] = y

    payload = {}
    payload["data"] = points
    payload["num_features"] = 5

    rv = client.post('/api/linreg/fit', data=json.dumps(payload),
                     content_type='application/json')
    resp_json = rv.get_json()
    coefficients = resp_json["coefficients"]

    assert len(coefficients) == 6


def test_fit_alpha(client):
    points = {}
    for x, y in zip(SAMPLE_X_VALS, SAMPLE_Y_VALS):
        points[x] = y

    payload = {}
    payload["data"] = points
    payload["num_features"] = 5
    payload["alpha"] = 10

    rv = client.post('/api/linreg/fit', data=json.dumps(payload),
                     content_type='application/json')
    resp_json = rv.get_json()
    coefficients = resp_json["coefficients"]

    assert len(coefficients) == 6


def test_fit_0_alpha(client):
    points = {}
    for x, y in zip(SAMPLE_X_VALS, SAMPLE_Y_VALS):
        points[x] = y

    payload = {}
    payload["data"] = points
    payload["num_features"] = 5
    payload["alpha"] = 0

    rv = client.post('/api/linreg/fit', data=json.dumps(payload),
                     content_type='application/json')
    resp_json = rv.get_json()
    coefficients = resp_json["coefficients"]

    assert len(coefficients) == 6


def test_fit_bad_alpha2(client):
    points = {}
    for x, y in zip(SAMPLE_X_VALS, SAMPLE_Y_VALS):
        points[x] = y

    payload = {}
    payload["data"] = points
    payload["alpha"] = -1

    rv = client.post('/api/linreg/fit', data=json.dumps(payload),
                     content_type='application/json')
    resp = rv.data

    assert resp == b"alpha must be non-negative"


def test_fit_bad_num_features(client):
    points = {}
    for x, y in zip(SAMPLE_X_VALS, SAMPLE_Y_VALS):
        points[x] = y

    payload = {}
    payload["data"] = points
    payload["num_features"] = 0

    rv = client.post('/api/linreg/fit', data=json.dumps(payload),
                     content_type='application/json')
    resp = rv.data

    assert resp == b"Number of features must be positive"


def test_fit_bad_num_features2(client):
    points = {}
    for x, y in zip(SAMPLE_X_VALS, SAMPLE_Y_VALS):
        points[x] = y

    payload = {}
    payload["data"] = points
    payload["num_features"] = -1

    rv = client.post('/api/linreg/fit', data=json.dumps(payload),
                     content_type='application/json')
    resp = rv.data

    assert resp == b"Number of features must be positive"

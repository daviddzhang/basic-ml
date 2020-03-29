from flask import json
from app.learning_curves.routes import TRAINING_SIZES

TRAINING_SIZES_LEN = len(TRAINING_SIZES)

def test_create_data_default(client):
    rv = client.get('/api/lcurve/data')
    json_res = rv.get_json()

    assert len(json_res) == 2000

def test_create_data_custom_degree(client):
    rv = client.get('/api/lcurve/data?degree=4')
    json_res = rv.get_json()

    # adding a degree shouldn't change size of data set generated
    assert len(json_res) == 2000


# difficult to unit test learning curve behavior - just testing properties of API response
def test_create_learning_curve(client):
    data = client.get('/api/lcurve/data?degree=2').get_json()

    payload = {}
    payload["data"] = data

    rv = client.post('/api/lcurve/create', data=json.dumps(payload),
                     content_type='application/json')
    resp = rv.get_json()

    assert len(resp["cv_score"]) == TRAINING_SIZES_LEN
    assert len(resp["training_score"]) == TRAINING_SIZES_LEN


def test_create_learning_curve_extra_payload_info(client):
    data = client.get('/api/lcurve/data?degree=2').get_json()

    payload = {}
    payload["data"] = data
    payload["num_features"] = 1
    payload["alpha"] = 2.0

    rv = client.post('/api/lcurve/create', data=json.dumps(payload),
                     content_type='application/json')
    resp = rv.get_json()

    assert len(resp["cv_score"]) == TRAINING_SIZES_LEN
    assert len(resp["training_score"]) == TRAINING_SIZES_LEN
from flask import json

def test_create_data_default(client):
    rv = client.get('/api/lcurve/data')
    json_res = rv.get_json()

    assert len(json_res) == 2000

def test_create_data_custom_degree(client):
    rv = client.get('/api/lcurve/data?degree=4')
    json_res = rv.get_json()

    # adding a degree shouldn't change size of data set generated
    assert len(json_res) == 2000


def test_create_learning_curve(client):
    data = client.get('/api/lcurve/data').get_json()

    payload = {}
    payload["data"] = data

    rv = client.post('/api/lcurve/create', data=json.dumps(payload),
                     content_type='application/json')
    resp = rv.data

    print(resp)
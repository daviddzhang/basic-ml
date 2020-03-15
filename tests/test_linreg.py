import numpy as np
import matplotlib.pyplot as plt
from app.linear_regression.routes import DEFAULT_NUMEXAMPLES


def test_generate_data_default_size(client):
    rv = client.get('/api/lreg/generate')
    json_res = rv.get_json()

    assert len(json_res) == DEFAULT_NUMEXAMPLES


def test_generate_data_custom_size(client):
    rv = client.get('/api/lreg/generate?numExamples=200')
    json_res = rv.get_json()

    assert len(json_res) == 200

# hard to test whether degree works via unit tests - was done manually
def test_generate_data_degree_no_impact(client):
    rv = client.get('/api/lreg/generate?degree=3&numExamples=200')
    json_res = rv.get_json()

    assert len(json_res) == 200

def test_bad_request_negative_degree(client):
    rv = client.get('/api/lreg/generate?degree=-1')
    assert rv.data == b"No negative parameters are allowed"


def test_bad_request_negative_numexamples(client):
    rv = client.get('/api/lreg/generate?numExamples=-2')
    assert rv.data == b"No negative parameters are allowed"

def test_bad_request_negative_params(client):
    rv = client.get('/api/lreg/generate?degree=-10&numExamples=-2')
    assert rv.data == b"No negative parameters are allowed"

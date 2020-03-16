import pytest
from app.ml_utils.data import generate_data

def test_generate_data_negative_degree():
    with pytest.raises(ValueError):
        generate_data(100, -2)

def test_generate_data_negative_examples():
    with pytest.raises(ValueError):
        generate_data(-1, 2)

def test_generate_data_size():
    assert len(generate_data(100, 2)) == 100
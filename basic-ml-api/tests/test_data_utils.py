import pytest

from app.ml_utils.data import *


def test_generate_data_negative_degree():
    with pytest.raises(ValueError):
        generate_data_json(100, -2)


def test_generate_data_negative_examples():
    with pytest.raises(ValueError):
        generate_data_json(-1, 2)


def test_generate_data_size():
    assert len(generate_data_json(100, 2)["data"]) == 100


def test_get_params_default():
    data, num_features, alpha = get_params_from_json({"data": None})
    assert num_features == 1
    assert alpha == 1


def test_get_params_negative_num_features():
    with pytest.raises(ValueError):
        get_params_from_json({"data": None, "num_features": -2, "alpha": 1})


def test_get_params_zero_num_features():
    with pytest.raises(ValueError):
        get_params_from_json({"data": None, "num_features": 0, "alpha": 1})


def test_get_params_negative_alpha():
    with pytest.raises(ValueError):
        get_params_from_json({"data": None, "num_features": 1, "alpha": -1})


def test_point_array_to_x_y():
    data = [[1,4], [2,3], [3,2], [4,1]]
    x, y = point_array_to_x_y(data)

    assert np.array_equal(x, np.array([1,2,3,4]).reshape(len(data),1))
    assert np.array_equal(y, np.array([4,3,2,1]).reshape(len(data), 1))
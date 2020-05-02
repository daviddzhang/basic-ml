import pytest

from app import create_app
from app.configs import TestingConfig


@pytest.fixture
def client(scope="function"):
    app = create_app(TestingConfig)
    client = app.test_client()

    ctx = app.app_context()
    ctx.push()

    yield client

    ctx.pop()
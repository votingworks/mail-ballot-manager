from flask.testing import FlaskClient
import pytest

from server import app
from .helpers import assert_ok, post_json

@pytest.fixture
def client():
    return app.test_client()

def test_index(client):
    rv = client.get("/")
    assert b"VxMail (by VotingWorks)" in rv.data



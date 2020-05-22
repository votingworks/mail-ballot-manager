import pytest

from server import app


@pytest.fixture
def client():
    return app.test_client()


def test_index(client):
    rv = client.get("/")
    assert b"VxMail Mail Ballot Manager - VotingWorks" in rv.data

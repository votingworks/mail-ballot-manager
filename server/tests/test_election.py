import pytest, json, uuid

from server import app, db
from server.models import MailElection
from .helpers import post_json

TEST_ELECTION_NAME = "test election"


@pytest.fixture
def client():
    return app.test_client()


@pytest.fixture
def election_id():
    MailElection.query.delete()
    e = MailElection(id=str(uuid.uuid4()), name=TEST_ELECTION_NAME)
    db.session.add(e)
    db.session.commit()
    yield e.id
    db.session.delete(e)


def test_election_list(client, election_id):
    rv = client.get("/api/mailelection/")
    elections = json.loads(rv.data)["elections"]
    assert len(elections) == 1
    assert elections[0]["id"] == election_id
    assert (
        elections[0]["name"] == MailElection.query.filter_by(id=election_id).one().name
    )


def test_election_create(client):
    rv = post_json(client, "/api/mailelection/", {"name": TEST_ELECTION_NAME})
    election = json.loads(rv.data)
    assert election["name"] == TEST_ELECTION_NAME

    rv = client.get("/api/mailelection/")
    elections = json.loads(rv.data)["elections"]
    assert len(elections) == 1
    assert elections[0]["id"] == election["id"]
    assert elections[0]["name"] == TEST_ELECTION_NAME

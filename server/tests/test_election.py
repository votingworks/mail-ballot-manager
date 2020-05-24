import pytest, json, uuid, os

from server import app, db
from server.models import MailElection
from .helpers import post_json, assert_ok

TEST_ELECTION_NAME = "test election"

with open(
    os.path.join(os.path.dirname(__file__), "election.json"), "rb"
) as definition_file:
    TEST_DEFINITION = definition_file.read()

with open(
    os.path.join(os.path.dirname(__file__), "ballotTemplate.pdf"), "rb"
) as ballot_template_file:
    TEST_BALLOT_TEMPLATE = ballot_template_file.read()


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


def test_election_setup(client):
    rv = post_json(client, "/api/mailelection/", {"name": TEST_ELECTION_NAME})
    election = json.loads(rv.data)
    assert election["id"]

    election_id = election["id"]

    rv = client.get("/api/mailelection/")
    elections = json.loads(rv.data)["elections"]
    assert len(elections) == 1
    assert elections[0]["id"] == election["id"]
    assert elections[0]["name"] == TEST_ELECTION_NAME
    assert elections[0]["voterCount"] == 0

    rv = client.get(f"/api/mailelection/{election_id}")
    election = json.loads(rv.data)
    assert election["id"] == election["id"]
    assert election["name"] == TEST_ELECTION_NAME
    assert election["voterCount"] == 0

    rv = client.put(
        f"/api/mailelection/{election_id}/definition",
        headers={"Content-Type": "application/json"},
        data=TEST_DEFINITION,
    )
    assert_ok(rv)

    rv = client.get(f"/api/mailelection/{election_id}/definition")
    assert rv.data == TEST_DEFINITION

    rv = client.put(
        f"/api/mailelection/{election_id}/ballot-style/12/precinct/21/template",
        headers={"Content-Type": "application/pdf"},
        data=TEST_BALLOT_TEMPLATE,
    )
    assert_ok(rv)

    rv = client.get(
        f"/api/mailelection/{election_id}/ballot-style/12/precinct/21/template"
    )
    assert rv.data == TEST_BALLOT_TEMPLATE

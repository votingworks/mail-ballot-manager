import pytest, uuid, os

from server import app, db
from server.models import MailElection

TEST_ELECTION_NAME = "test election"

with open(
    os.path.join(os.path.dirname(__file__), "election.json"), "rb"
) as definition_file:
    TEST_DEFINITION = definition_file.read()

with open(
    os.path.join(os.path.dirname(__file__), "ballotTemplate.pdf"), "rb"
) as ballot_template_file:
    TEST_BALLOT_TEMPLATE = ballot_template_file.read()

with open(os.path.join(os.path.dirname(__file__), "voters.csv"), "rb") as voters_file:
    TEST_VOTERS = voters_file.read()


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

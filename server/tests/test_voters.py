import json

from .helpers import assert_ok
from .fixtures import TEST_VOTERS
from .fixtures import client, election_id  # pylint: disable=unused-import


def test_voters(client, election_id):
    rv = client.put(
        f"/api/mailelection/{election_id}/voters/file",
        headers={"Content-Type": "application/csv"},
        data=TEST_VOTERS,
    )
    assert_ok(rv)

    rv = client.get(f"/api/mailelection/{election_id}/voters",)
    voters = json.loads(rv.data)["voters"]
    assert len(voters) == 1000

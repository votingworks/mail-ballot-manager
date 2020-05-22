import uuid, hashlib, json
from flask import jsonify, request

from . import app, API_URL_PREFIX
from .models import *


def serialize_election(election, expand=False):
    election_obj = {
        "id": election.id,
        "createdAt": election.created_at,
        "name": election.name,
        "approvedAt": election.approved_at,
        "approvedBy": election.approved_by,
        ## TODO: review efficiency here to make sure it doesn't load all voters
        ## https://github.com/votingworks/mail-ballot-manager/issues/23
        "voterCount": len(election.voters),
    }

    if election.definition:
        definition = json.loads(election.definition)
        election_obj["electionHash"] = hashlib.sha256(election.definition).hexdigest()
        election_obj["electionTitle"] = definition["title"]
        election_obj["electionDate"] = definition["date"]

    if expand:
        # TODO: add mailingListFiles when we have them.
        pass

    return election_obj


@app.route(f"{API_URL_PREFIX}/mailelection/", methods=["GET"])
def mailelection_list():
    return jsonify(elections=[serialize_election(e) for e in MailElection.query.all()])


@app.route(f"{API_URL_PREFIX}/mailelection/", methods=["POST"])
def mailelection_create():
    election_json = request.get_json()

    election = MailElection(id=str(uuid.uuid4()), name=election_json["name"])
    db.session.add(election)
    db.session.commit()

    return jsonify(id=election.id)


@app.route(f"{API_URL_PREFIX}/mailelection/<election_id>", methods=["GET"])
def mailelection_one(election_id):
    return jsonify(
        serialize_election(
            MailElection.query.filter_by(id=election_id).one(), expand=True
        )
    )
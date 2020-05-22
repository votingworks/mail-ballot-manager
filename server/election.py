import uuid, hashlib, json
from flask import jsonify, request

from . import app, API_URL_PREFIX
from .models import *
from .util.jsonschema import validate
from .schemas import ELECTION_SCHEMA


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


@app.route(f"{API_URL_PREFIX}/mailelection/<election_id>/definition", methods=["GET"])
def mailelection_definition_get(election_id):
    election = MailElection.query.filter_by(id=election_id).one()
    return election.definition, 200, {"Content-Type": "application/json"}


@app.route(f"{API_URL_PREFIX}/mailelection/<election_id>/definition", methods=["PUT"])
def mailelection_definition_set(election_id):
    election_data = request.data.decode("utf-8")
    election_json = json.loads(election_data)
    validate(schema=ELECTION_SCHEMA, instance=election_json)

    election = MailElection.query.filter_by(id=election_id).one()
    election.definition = election_data
    db.session.commit()

    return jsonify(status="ok")

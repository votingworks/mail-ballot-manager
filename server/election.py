import uuid, hashlib, json
from flask import jsonify, request, make_response

from . import app, API_URL_PREFIX
from .models import *
from .util.jsonschema import validate
from .schemas import ELECTION_SCHEMA
from .security import with_mailelection_admin


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


def get_ballot_style(election_definition, ballot_style_id, precinct_id):
    ballot_styles = [
        bs
        for bs in election_definition["ballotStyles"]
        if bs["id"] == ballot_style_id and precinct_id in bs["precincts"]
    ]
    if len(ballot_styles) == 1:
        return ballot_styles[0]
    else:
        return None


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
@with_mailelection_admin
def mailelection_one(election):
    return jsonify(serialize_election(election, expand=True))


@app.route(f"{API_URL_PREFIX}/mailelection/<election_id>/definition", methods=["GET"])
@with_mailelection_admin
def mailelection_definition_get(election):
    return election.definition, 200, {"Content-Type": "application/json"}


@app.route(f"{API_URL_PREFIX}/mailelection/<election_id>/definition", methods=["PUT"])
@with_mailelection_admin
def mailelection_definition_set(election):
    election_data = request.data.decode("utf-8")
    election_json = json.loads(election_data)
    validate(schema=ELECTION_SCHEMA, instance=election_json)

    election.definition = election_data
    db.session.commit()

    return jsonify(status="ok")


@app.route(
    f"{API_URL_PREFIX}/mailelection/<election_id>/ballot-style/<ballot_style_id>/precinct/<precinct_id>/template",
    methods=["PUT"],
)
@with_mailelection_admin
def ballot_template_set(election, ballot_style_id, precinct_id):
    if not election.definition:
        return (
            jsonify(
                error="ballot templates can only be uploaded after the election definition has been uploaded."
            ),
            409,
        )

    election_definition = json.loads(election.definition)
    ballot_style = get_ballot_style(election_definition, ballot_style_id, precinct_id)

    if not ballot_style:
        return (
            jsonify(
                error=f"ballot style {ballot_style_id} in precinct {precinct_id} not found"
            ),
            404,
        )

    args = {
        "mail_election_id": election.id,
        "ballot_style_id": ballot_style_id,
        "precinct_id": precinct_id,
    }

    ballot_template = BallotTemplate.query.filter_by(**args).one_or_none()

    if not ballot_template:
        ballot_template = BallotTemplate(id=str(uuid.uuid4()), **args)
        db.session.add(ballot_template)

    ballot_template.pdf = request.data
    db.session.commit()

    return jsonify(status="ok")


@app.route(
    f"{API_URL_PREFIX}/mailelection/<election_id>/ballot-style/<ballot_style_id>/precinct/<precinct_id>/template",
    methods=["GET"],
)
@with_mailelection_admin
def ballot_template_get(election, ballot_style_id, precinct_id):
    ballot_template = BallotTemplate.query.filter_by(
        mail_election_id=election.id,
        ballot_style_id=ballot_style_id,
        precinct_id=precinct_id,
    ).one_or_none()

    if not ballot_template:
        return (jsonify(error="no such ballot template"), 404)

    response = make_response(ballot_template.pdf)
    response.headers.set("Content-Type", "application/pdf")
    return response


# @app.route(f"{API_URL_PREFIX}/mailelection/<election_id>/voters/file", methods=["PUT"])
# @with_mailelection_admin
# def voters_file_set(election):
#    pass

# @app.route(f"{API_URL_PREFIX}/mailelection/<election_id>/voters", methods=["GET"])
# @with_mailelection_admin
# def voters(election):
#    pass

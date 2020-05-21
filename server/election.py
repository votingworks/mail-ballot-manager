import uuid
from flask import jsonify, request

from . import app
from .models import *


def serialize_election(election):
    return {
        "id": election.id,
        "name": election.name,
        "affidavit": election.affidavit,
        "instructions": election.instructions,
        "helpPhone": election.help_phone,
        "helpEmail": election.help_email,
        "helpWeb": election.help_web,
        "helpAddress": election.help_address,
        "approvedAt": election.approved_at,
        "approvedBy": election.approved_by,
    }


@app.route("/api/election/", methods=["GET"])
def election_list():
    return jsonify(elections=[serialize_election(e) for e in Election.query.all()])


@app.route("/api/election/", methods=["POST"])
def election_create():
    election_json = request.get_json()

    election = Election(id=str(uuid.uuid4()), name=election_json["name"])
    db.session.add(election)
    db.session.commit()

    return jsonify(serialize_election(election))

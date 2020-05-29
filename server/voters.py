import uuid
from flask import jsonify, request

from . import app, API_URL_PREFIX
from .models import *
from .util.csv_parse import parse_csv, CSVValueType, CSVColumnType
from .security import with_mailelection_admin

VOTER_ID = "Voter ID"
BALLOT_STYLE_ID = "Ballot Style ID"
PRECINCT_ID = "Precinct ID"
FIRST_NAME = "First Name"
MIDDLE_NAME = "Middle Name"
LAST_NAME = "Last Name"
NAME_SUFFIX = "Name Suffix"
STREET_1 = "Street 1"
STREET_2 = "Street 2"
CITY = "City"
STATE = "State"
ZIP_CODE = "Zip Code"

VOTERS_COLUMNS = [
    CSVColumnType(VOTER_ID, CSVValueType.TEXT, unique=True),
    CSVColumnType(BALLOT_STYLE_ID, CSVValueType.TEXT),
    CSVColumnType(PRECINCT_ID, CSVValueType.TEXT),
    CSVColumnType(FIRST_NAME, CSVValueType.TEXT),
    CSVColumnType(MIDDLE_NAME, CSVValueType.TEXT, required=False),
    CSVColumnType(LAST_NAME, CSVValueType.TEXT),
    CSVColumnType(NAME_SUFFIX, CSVValueType.TEXT, required=False),
    CSVColumnType(STREET_1, CSVValueType.TEXT),
    CSVColumnType(STREET_2, CSVValueType.TEXT, required=False),
    CSVColumnType(CITY, CSVValueType.TEXT),
    CSVColumnType(STATE, CSVValueType.TEXT),
    CSVColumnType(ZIP_CODE, CSVValueType.TEXT),
]

# TODO: this needs to be (1) a background process that (2) streams the file.
def process_voter_file_content(session, mailelection, content):
    voters_csv = parse_csv(content, VOTERS_COLUMNS)

    for row in voters_csv:
        voter = Voter(
            id=str(uuid.uuid4()),
            mail_election_id=mailelection.id,
            voter_id=row[VOTER_ID],
            ballot_style_id=row[BALLOT_STYLE_ID],
            precinct_id=row[PRECINCT_ID],
            first_name=row[FIRST_NAME],
            middle_name=row[MIDDLE_NAME],
            last_name=row[LAST_NAME],
            name_suffix=row[NAME_SUFFIX],
            street_1=row[STREET_1],
            street_2=row[STREET_2],
            city=row[CITY],
            state=row[STATE],
            zip_code=row[ZIP_CODE],
        )

        session.add(voter)


def serialize_voter(voter):
    return {
        "id": voter.id,
        "voterId": voter.voter_id,
        "ballotStyleId": voter.ballot_style_id,
        "precinctId": voter.precinct_id,
        "firstName": voter.first_name,
        "middleName": voter.middle_name,
        "lastName": voter.last_name,
        "nameSuffix": voter.name_suffix,
        "street1": voter.street_1,
        "street2": voter.street_2,
        "city": voter.city,
        "state": voter.state,
        "zipCode": voter.zip_code,
    }


@app.route(
    f"{API_URL_PREFIX}/mailelection/<mailelection_id>/voters/file", methods=["PUT"]
)
@with_mailelection_admin
def voters_file_set(mailelection):
    Voter.query.delete()
    process_voter_file_content(db.session, mailelection, request.data.decode("utf-8"))
    db.session.commit()

    return jsonify(status="ok")


@app.route(f"{API_URL_PREFIX}/mailelection/<mailelection_id>/voters", methods=["GET"])
@with_mailelection_admin
def voters(mailelection):
    voters = Voter.query.filter_by(mail_election_id=mailelection.id).all()

    return jsonify(voters=[serialize_voter(v) for v in voters])

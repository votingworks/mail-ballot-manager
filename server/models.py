import sqlalchemy as sa
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy, Model
from flask_sqlalchemy.model import DefaultMeta
from datetime import datetime as dt


class Base(Model):
    created_at = sa.Column(sa.DateTime, default=dt.utcnow, nullable=False)
    updated_at = sa.Column(
        sa.DateTime, default=dt.utcnow, onupdate=dt.utcnow, nullable=False
    )


db = SQLAlchemy(model_class=Base)

# Typing workaround from https://github.com/dropbox/sqlalchemy-stubs/issues/76#issuecomment-595839159
BaseModel: DefaultMeta = db.Model

# on-delete-cascade is done in SQLAlchemy like this:
# https://stackoverflow.com/questions/5033547/sqlalchemy-cascade-delete


class MailElection(BaseModel):
    id = db.Column(db.String(200), primary_key=True)
    name = db.Column(db.String(200), nullable=False)

    definition = db.Column(db.Text, nullable=True)

    affidavit = db.Column(db.Text, nullable=True)
    instructions = db.Column(db.Text, nullable=True)
    help_phone = db.Column(db.String(20), nullable=True)
    help_email = db.Column(db.String(100), nullable=True)
    help_web = db.Column(db.String(250), nullable=True)
    help_address = db.Column(db.Text, nullable=True)

    approved_at = db.Column(sa.DateTime, nullable=True)
    approved_by = db.Column(db.Text, nullable=True)

    voters = relationship("Voter", backref="election", passive_deletes=True)


class BallotTemplate(BaseModel):
    id = db.Column(db.String(200), primary_key=True)
    mail_election_id = db.Column(
        db.String(200),
        db.ForeignKey(MailElection.id, ondelete="cascade"),
        nullable=False,
    )
    ballot_style = db.Column(db.String(30), nullable=False)
    precinct = db.Column(db.String(30), nullable=False)

    __table_args__ = (
        db.UniqueConstraint("mail_election_id", "ballot_style", "precinct"),
    )

    pdf = db.Column(db.LargeBinary)


class MailingListFile(BaseModel):
    id = db.Column(db.String(200), primary_key=True)
    mail_election_id = db.Column(
        db.String(200),
        db.ForeignKey(MailElection.id, ondelete="cascade"),
        nullable=False,
    )

    label = db.Column(db.String(500), nullable=True)
    csv_content = db.Column(db.Text)


class Voter(BaseModel):
    id = db.Column(db.String(200), primary_key=True)
    election_id = db.Column(
        db.String(200),
        db.ForeignKey(MailElection.id, ondelete="cascade"),
        nullable=False,
    )
    ballot_template_id = db.Column(
        db.String(200),
        db.ForeignKey(BallotTemplate.id, ondelete="cascade"),
        nullable=False,
    )

    first_name = db.Column(db.String(200), nullable=True)
    middle_name = db.Column(db.String(200), nullable=True)
    last_name = db.Column(db.String(200), nullable=True)
    name_suffix = db.Column(db.String(200), nullable=True)

    street_1 = db.Column(db.Text, nullable=True)
    street_2 = db.Column(db.Text, nullable=True)
    city = db.Column(db.String(200), nullable=True)
    state = db.Column(db.String(200), nullable=True)
    zip_code = db.Column(db.String(200), nullable=True)

    printer_received_at = db.Column(sa.DateTime, nullable=True)
    printer_printed_at = db.Column(sa.DateTime, nullable=True)
    outbound_sent_at = db.Column(sa.DateTime, nullable=True)
    outbound_delivered_at = db.Column(sa.DateTime, nullable=True)
    inbound_sent_at = db.Column(sa.DateTime, nullable=True)
    inbound_delivered_at = db.Column(sa.DateTime, nullable=True)

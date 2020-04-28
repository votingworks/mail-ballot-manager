from sqlalchemy.orm import relationship, backref
import sqlalchemy as sa
from enum import Enum
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



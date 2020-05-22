"""
Load the JSON schemas and make them available as Python vars.
"""

import os, json

BASE_DIRECTORY = os.path.join(os.path.join(os.path.dirname(__file__), ".."), "schemas")


def load_schema(filename):
    location = os.path.join(BASE_DIRECTORY, filename)
    f = open(location, "r")
    schema = json.loads(f.read())
    f.close()
    return schema


ELECTION_SCHEMA = load_schema("election.schema.json")

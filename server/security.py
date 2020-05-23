import functools
from typing import Callable

from .models import MailElection


def with_mailelection_admin(route: Callable):
    """
    Flask route decorator that restricts access to a route to admins of an election.
    """

    @functools.wraps(route)
    def wrapper(*args, **kwargs):
        if "election_id" not in kwargs:
            raise Exception(f"expected 'election_id' in kwargs but got: {kwargs}")

        election = MailElection.query.get_or_404(kwargs.pop("election_id"))

        ## TODO: permission check

        kwargs["election"] = election

        return route(*args, **kwargs)

    return wrapper

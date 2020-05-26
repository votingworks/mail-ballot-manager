import functools
from typing import Callable

from .models import MailElection


def with_mailelection_admin(route: Callable):
    """
    Flask route decorator that restricts access to a route to admins of an election.
    """

    @functools.wraps(route)
    def wrapper(*args, **kwargs):
        if "mailelection_id" not in kwargs:
            raise Exception(f"expected 'mailelection_id' in kwargs but got: {kwargs}")

        mailelection = MailElection.query.get_or_404(kwargs.pop("mailelection_id"))

        ## TODO: permission check

        kwargs["mailelection"] = mailelection

        return route(*args, **kwargs)

    return wrapper

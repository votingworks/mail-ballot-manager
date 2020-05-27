FROM python:3.7-slim-buster

ENV PYTHONDONTWRITEBYTECODE=1

# Tell pipenv to store virtualenvs here.
ENV WORKON_HOME=/code/docker-artifacts/_docker_venvs

RUN apt-get update && apt-get install -y --no-install-recommends \
    make \
    libpython3.7-dev \
    libpq-dev

RUN python3.7 -m pip install pipenv

WORKDIR /code
#!/usr/bin/env bash

export FLASK_ENV=development
(trap 'kill 0' SIGINT SIGHUP; pipenv run python app.py & yarn --cwd client start)

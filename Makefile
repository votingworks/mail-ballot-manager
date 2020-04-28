PIPENV=python3.7 -m pipenv

deps:
	sudo apt install python3.7 python3-pip nodejs libpython3.7-dev libpq-dev
	python3.7 -m pip install pipenv
	sudo npm install -g yarn
	sudo apt install postgresql

# this should only be used for development
initdevdb:
	sudo -u postgres psql -c "create user mbm superuser password 'mbm';"
	sudo -u postgres psql -c "create database mbm with owner mbm;"

install:
	${PIPENV} install
	yarn install
	yarn --cwd client install
	yarn --cwd client build

install-development:
	${PIPENV} install --dev
	yarn install
	yarn --cwd client install

resettestdb:
	FLASK_ENV=test make resetdb

resetdb:
	FLASK_ENV=$${FLASK_ENV:-development} ${PIPENV} run python resetdb.py

dev-environment: deps initdevdb install-development resetdb

typecheck-server:
	${PIPENV} run mypy .

format-server:
	${PIPENV} run black .

lint-server:
	find . -name '*.py' | xargs ${PIPENV} run pylint

test-client:
	yarn --cwd client lint
	yarn --cwd client test

# To run tests matching a search string: TEST=<search string> make test-server
# To run specific test files: FILE=<file path> make test-server
# To pass in additional flags to pytest: FLAGS=<extra flags> make test-server
test-server:
	FLASK_ENV=test ${PIPENV} run python -m pytest ${FILE} \
		-k '${TEST}' --ignore=client -vv ${FLAGS}

test-server-coverage:
	FLAGS='--cov=. ${FLAGS}' make test-server

python-shell:
	${PIPENV} run python

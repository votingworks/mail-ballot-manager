PIPENV=python3.7 -m pipenv

deps:
	# When updating these deps, keep them in sync with the Docker images.
	sudo apt install python3.7 python3-pip nodejs libpython3.7-dev libpq-dev
	python3.7 -m pip install pipenv
	sudo npm install -g yarn
	sudo apt install postgresql

# this should only be used for development
initdevdb:
	sudo -u postgres psql -h $${DATABASE_HOST:-localhost} -c "create user mbm superuser password 'mbm';"
	sudo -u postgres psql -h $${DATABASE_HOST:-localhost} -c "create database mbm with owner mbm;"

docker-initdevdb:
	docker-compose run db make initdevdb

install-project:
	# This installs local deps for linting and such.
	yarn install

install-server:
	${PIPENV} install

install-server-dev:
	${PIPENV} install --dev

docker-install-server-dev:
	docker-compose run server make install-server-dev

install-client:
	yarn --cwd client install

install: install-project install-server install-client
	yarn --cwd client build

install-development: install-project install-server-dev install-client

resettestdb:
	FLASK_ENV=test make resetdb

resetdb:
	FLASK_ENV=$${FLASK_ENV:-development} ${PIPENV} run python resetdb.py

docker-resetdb:
	docker-compose run server make resetdb

dev-environment: deps initdevdb install-development resetdb

docker-dev: install-project
	docker-compose run server make install-server-dev
	docker-compose run client make install-client
	docker-compose restart || docker-compose up -d
	docker-compose logs -f

docker-rebuild:
	docker-compose build
	make docker-dev

typecheck-server:
	${PIPENV} run mypy .

format-server:
	${PIPENV} run black .

lint-server:
	find . -name '*.py' | xargs ${PIPENV} run pylint

test-client:
#	yarn --cwd client lint
	yarn --cwd client test

docker-test-client:
	docker-compose run client make test-client

# To run tests matching a search string: TEST=<search string> make test-server
# To run specific test files: FILE=<file path> make test-server
# To pass in additional flags to pytest: FLAGS=<extra flags> make test-server
test-server:
	FLASK_ENV=test ${PIPENV} run python -m pytest ${FILE} \
		-k '${TEST}' --ignore=client -vv ${FLAGS}

docker-test-server:
	docker-compose run \
		-e FILE="${FILE}" \
		-e TEST="${TEST}" \
		-e FLAGS="${FLAGS}" \
		server make test-server

test-server-coverage:
	FLAGS='--cov=. ${FLAGS}' make test-server

python-shell:
	${PIPENV} run python

docker-python-shell:
	docker-compose run server make python-shell

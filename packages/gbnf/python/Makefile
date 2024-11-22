SHELL := /bin/bash

init:
	uv venv --python python3.12

lint:
	uvx ruff check . --fix

copy_assets:
	cp ../../../LICENSE ./ 

build_all:
	make copy_assets && make build_package

build_package:
	python3 -m build

upgrade_dev_dependencies:
	./upgrade_dev_dependencies.sh

build_test_writer:
	cd ../../test-writer && pnpm build

write_integration_tests:
	make build_test_writer && rm -rf ./tests/generated && ../../test-writer/dist/test-writer.mjs --testDir ../test --targetDir ./tests/generated --language python

test_integration:
	make build_test_writer && rm -rf ./tests/generated && write-tests --testDir ../test --targetDir ./integration-tests/generated

test:
	make test_unit

test_unit:
	uv run pytest ./gbnf

SHELL := /bin/bash

init:
	uv venv --python python3.12 && uv sync

lint:
	uvx ruff check . --fix

copy_assets:
	cp ../../../LICENSE ./ 

build_all:
	make copy_assets && make build_package

build_package:
	uv run --with build -m build

upgrade_dev_dependencies:
	./upgrade_dev_dependencies.sh

build_test_writer:
	cd ../../test-writer && pnpm build

write_integration_tests:
	make build_test_writer \
	&& rm -rf ./tests/generated \
	&& ../../test-writer/dist/test-writer.mjs \
		validation/validate-grammar.md \
		--testDir ../test \
		--targetDir ./tests/generated \
		--language python

# test_integration_watch:
# 	uv run ptw --now ./tests/generated

test_integration:
	uv run pytest ./tests/generated

test:
	make test_unit

test_unit:
	uv run pytest ./gbnf/**/*_test.py

test_unit_watch:
	uv run ptw --now .

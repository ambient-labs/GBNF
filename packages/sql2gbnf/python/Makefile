SHELL := /bin/bash

init:
	uv venv --python python3.12 && uv sync

test:
	make copy_js_package && source .venv/bin/activate && pytest .

test_unit:
	uv run pytest ./sql2gbnf

lint:
	uvx ruff check . --fix

copy_assets:
	cp ../../../LICENSE ./ 

build_all:
	make copy_assets && make build_package

build_package:
	make copy_js_package &&	uv run --with build -m build 

copy_js_package:
	rm -rf sql2gbnf/js && mkdir -p sql2gbnf/js && cd ../javascript/ && pnpm build && cp -R dist/. ../python/sql2gbnf/js

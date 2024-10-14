SHELL := /bin/bash

init:
	source .venv/dev/bin/activate && pip install -r requirements.txt

upgrade_dev_deps:
	source .venv/dev/bin/activate && ./upgrade-dev-dependencies.sh && pip install -r dev-deps/python3.11/dev.txt

test:
	make copy_js_package && source .venv/dev/bin/activate && pytest .

lint:
	uvx ruff check . --fix

copy_assets:
	cp ../../../LICENSE ./ 

build_all:
	make copy_assets && make build_package

build_package:
	source .venv/dev/bin/activate && make copy_js_package && python3 -m build

copy_js_package:
	rm -rf sql2gbnf/js && mkdir -p sql2gbnf/js && cd ../javascript/ && pnpm build && cp -R dist/. ../python/sql2gbnf/js

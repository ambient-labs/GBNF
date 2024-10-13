SHELL := /bin/bash

init:
	source .venv/dev/bin/activate && pip install -r requirements.txt

test:
	uvx pytest .

lint:
	uvx ruff check . --fix

copy_assets:
	cp ../../../LICENSE ./ 

build_all:
	make copy_assets && make build_package

build_package:
	source .venv/dev/bin/activate && python3 -m build

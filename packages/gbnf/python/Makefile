SHELL := /bin/bash

init:
	pip install -r requirements.txt

test:
	uvx pytest .

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

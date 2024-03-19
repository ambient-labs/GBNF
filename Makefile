SHELL := /bin/bash

test_js:
	&& cd packages/gbnf/javascript \
	&& make test \
	&& cd - \
	&& cd packages/json2gbnf/javascript \
	&& make test \
	&& cd - \
	&& cd packages/contort \
	&& make test

test_py:
	&& cd packages/gbnf/python \
	&& make test \
	&& cd - \
	&& cd packages/json2gbnf/python \
	&& make test

test:
	make test_js && make test_py

lint_js:
	&& cd packages/contort \
	&& make lint \
	&& cd - \
	&& cd packages/gbnf/javascript \
	&& make lint \
	&& cd - \
	&& cd packages/json2gbnf/javascript \
	&& make lint

lint_py:
	&& cd packages/gbnf/python \
	&& make lint \
	&& cd - \
	&& cd packages/json2gbnf/python \
	&& make lint

lint:
	make lint_js && make lint_py

build_js:
	&& cd packages/contort \
	&& make build_all \
	&& cd - \
	&& cd packages/gbnf/javascript \
	&& make build_all \
	&& cd - \
	&& cd packages/json2gbnf/javascript \
	&& make build

build_py:
	&& cd packages/gbnf/python \
	&& make build_all \
	&& cd - \
	&& cd packages/json2gbnf/python \
	&& make build

build_all:
	make build_js && make build_py

init_py:
	&& cd packages/gbnf/python \
	&& make init \
	&& cd - \
	&& cd packages/json2gbnf/python \
	&& make init 

init:
	make init_py

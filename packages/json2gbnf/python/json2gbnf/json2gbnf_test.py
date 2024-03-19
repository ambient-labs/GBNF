from .json2gbnf import json2gbnf
import pytest

@pytest.mark.parametrize(
    ("schema"),
    [
        ({}),
    ],
)
def test_it_calls_json2gbnf(schema):
    json2gbnf(schema)

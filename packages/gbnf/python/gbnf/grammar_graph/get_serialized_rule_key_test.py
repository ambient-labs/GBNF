from __future__ import annotations

from unittest.mock import patch

import pytest

from .get_serialized_rule_key import KEY_TRANSLATION, get_serialized_rule_key
from .grammar_graph_types import RuleChar, RuleCharExclude, RuleEnd, RuleRef, RuleType


@pytest.fixture(autouse=True)
def mock_is_rule_end():
    with patch(
        "gbnf.grammar_graph.get_serialized_rule_key.is_rule_end",
        return_value=False,
    ) as mock:
        yield mock


@pytest.fixture(autouse=True)
def mock_is_rule_char():
    with patch(
        "gbnf.grammar_graph.get_serialized_rule_key.is_rule_char",
        return_value=False,
    ) as mock:
        yield mock


@pytest.fixture(autouse=True)
def mock_is_rule_char_exclude():
    with patch(
        "gbnf.grammar_graph.get_serialized_rule_key.is_rule_char_exclude",
        return_value=False,
    ) as mock:
        yield mock


@pytest.fixture(autouse=True)
def mock_is_rule_ref():
    with patch(
        "gbnf.grammar_graph.get_serialized_rule_key.is_rule_ref",
        return_value=False,
    ) as mock:
        yield mock


def describe_get_serialized_rule_key():
    def test_returns_type_for_end_rules(mock_is_rule_end):
        mock_is_rule_end.return_value = True
        rule = RuleEnd()
        assert get_serialized_rule_key(rule) == f"{KEY_TRANSLATION[RuleType.END]}"

    def test_returns_type_and_value_for_character_rules(mock_is_rule_char):
        mock_is_rule_char.return_value = True
        rule = RuleChar(value=[97])
        assert get_serialized_rule_key(rule) == f"{KEY_TRANSLATION[RuleType.CHAR]}-[97]"

    def test_returns_type_and_value_for_character_exclude_rules(
        mock_is_rule_char_exclude,
    ):
        mock_is_rule_char_exclude.return_value = True
        rule = RuleCharExclude(value=[97])
        assert (
            get_serialized_rule_key(rule)
            == f"{KEY_TRANSLATION[RuleType.CHAR_EXCLUDE]}-[97]"
        )

    def test_returns_ref_type_with_value_for_reference_rules(mock_is_rule_ref):
        mock_is_rule_ref.return_value = True
        rule = RuleRef(99)
        assert get_serialized_rule_key(rule) == "3-99"

    def test_throws_error_for_unknown_rule_types(
        mock_is_rule_end,
        mock_is_rule_char,
        mock_is_rule_char_exclude,
        mock_is_rule_ref,
    ):
        mock_is_rule_end.return_value = False
        mock_is_rule_char.return_value = False
        mock_is_rule_char_exclude.return_value = False
        mock_is_rule_ref.return_value = False
        rule = {"type": "UNKNOWN", "value": "something"}
        with pytest.raises(
            ValueError,
            match=r"Unknown rule type: {'type': 'UNKNOWN', 'value': 'something'}",
        ):
            get_serialized_rule_key(rule)

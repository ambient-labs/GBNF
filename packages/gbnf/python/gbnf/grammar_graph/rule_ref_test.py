import pytest
from .rule_ref import RuleRef, GraphNode


def describe_rule_ref():
    def test_initializes_with_a_given_value(self):
        ruleRef = RuleRef(123)
        assert ruleRef.value == 123

    def test_allows_setting_and_getting_nodes(self):
        mockNodes: set[GraphNode] = {1}
        ruleRef = RuleRef(123)
        ruleRef.nodes = mockNodes
        assert ruleRef.nodes == mockNodes

    def test_throws_an_error_if_trying_to_get_nodes_before_setting(self):
        ruleRef = RuleRef(123)
        with pytest.raises(ValueError) as context:
            ruleRef.nodes
        assert str(context.value) == "Nodes are not set"

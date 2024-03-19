import pythonmonkey as pm

json2gbnfjs = pm.require("./js/index.umd.cjs")["default"]


def json2gbnf(
    schema: dict, fixed_order: None | bool = None, whitespace: None | int = None
) -> str:
    return json2gbnfjs(schema, {"fixedOrder": fixed_order, "whitespace": whitespace})

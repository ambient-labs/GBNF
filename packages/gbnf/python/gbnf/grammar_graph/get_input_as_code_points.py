
from .grammar_graph_types import ValidInput


def get_code_point(char: str) -> int:
    code_point = ord(char)
    if code_point is None:
        raise ValueError(f"Could not get code point for character: {char}")
    return code_point


def get_input_as_code_points(src: ValidInput) -> list[int]:
    if not isinstance(src, str):
        return list(src) if isinstance(src, list) else [src]

    return [get_code_point(s) for s in src]

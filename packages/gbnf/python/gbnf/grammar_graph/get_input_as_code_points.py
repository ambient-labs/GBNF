from .grammar_graph_types import ValidInput


def get_code_point(char: str) -> int:
    code_point = ord(char)
    if code_point is None:
        raise ValueError(f"Could not get code point for character: {char}")
    if type(code_point) is not int:
        raise ValueError("code_point must be an integer!")
    return code_point


def get_input_as_code_points(src: ValidInput) -> list[int]:
    if isinstance(src, int):
        return [src]

    if isinstance(src, list):
        for c in src:
            if type(c) is not int:
                raise ValueError(
                    f"code_point must be an integer for {c} if src is a list",
                )
        return src

    if isinstance(src, str):
        return [get_code_point(s) for s in src]

    raise ValueError(f"Invalid input type: {type(src)}")

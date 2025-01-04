from .errors_types import ValidInput


def get_input_as_string(src: ValidInput) -> str:
    if isinstance(src, str):
        return src
    if isinstance(src, int):
        return chr(src)
    return "".join(chr(cp) for cp in src)

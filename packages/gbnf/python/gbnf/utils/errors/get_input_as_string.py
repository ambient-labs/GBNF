

def get_input_as_string(src: str | int | list[int]) -> str:
    if isinstance(src, str):
        return src
    if isinstance(src, int):
        return chr(src)
    return "".join(chr(cp) for cp in src)

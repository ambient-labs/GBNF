def parse_space(src: str, pos: int, newline_ok: bool) -> int:
    while pos < len(src) and (
        src[pos] == " "
        or src[pos] == "\t"
        or src[pos] == "#"
        or (newline_ok and (src[pos] == "\r" or src[pos] == "\n"))
    ):
        if src[pos] == "#":
            while pos < len(src) and src[pos] not in ("\r", "\n"):
                pos += 1
        else:
            pos += 1
    return pos

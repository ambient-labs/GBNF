from .errors import GrammarParseError


def parse_char(src: str, pos: int):
    if pos >= len(src):
        raise GrammarParseError(
            src,
            pos,
            "Unexpected end of grammar input, failed to complete parse",
        )

    if src[pos] == "\\":
        if src[pos + 1] == "x":
            return (int(src[pos + 2 : pos + 4], 16), 4)
        if src[pos + 1] == "u":
            return (int(src[pos + 2 : pos + 6], 16), 6)
        if src[pos + 1] == "U":
            return (int(src[pos + 2 : pos + 10], 16), 10)
        if src[pos + 1] in ["t", "r", "n"]:
            return (ord(eval(f"'\\{src[pos + 1]}'")), 2)
        if src[pos + 1] in ['"', "[", "]", "\\"]:
            return (ord(src[pos + 1]), 2)
        raise GrammarParseError(src, pos, f"Unknown escape at {src[pos]}")

    return (ord(src[pos]), 1)

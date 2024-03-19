from .errors import GrammarParseError
from .is_word_char import is_word_char

PARSE_NAME_ERROR = "Failed to find a valid name"

VALID_NAME_SEPARATORS = [
    "-",
    "_",
]


def parse_name(grammar: str, pos: int) -> str:
    name = ""
    while pos < len(grammar) and (
        is_word_char(grammar[pos]) or grammar[pos] in VALID_NAME_SEPARATORS
    ):
        name += grammar[pos]
        pos += 1
    if not name:
        raise GrammarParseError(grammar, pos, PARSE_NAME_ERROR)
    return name

import re


def is_word_char(c: str) -> bool:
    return re.search(r"[a-zA-Z]", c) is not None

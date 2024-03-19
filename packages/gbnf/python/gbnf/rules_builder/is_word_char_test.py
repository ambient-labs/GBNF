from .is_word_char import is_word_char


def test_should_return_true_for_lowercase_letters():
    assert is_word_char("a")
    assert is_word_char("z")


def test_should_return_true_for_uppercase_letters():
    assert is_word_char("A")
    assert is_word_char("Z")


def test_should_return_false_for_digits():
    assert not is_word_char("0")
    assert not is_word_char("9")


def test_should_return_false_for_non_word_characters():
    assert not is_word_char("-")
    assert not is_word_char("@")
    assert not is_word_char("_")
    assert not is_word_char("?")
    assert not is_word_char(" ")

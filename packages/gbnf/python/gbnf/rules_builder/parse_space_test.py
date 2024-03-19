from .parse_space import parse_space


def test_return_input_string_when_no_whitespace_or_comments():
    input_str = "abcdefghijk"
    pos = parse_space(input_str, 0, True)
    assert input_str[pos:] == input_str


def test_skip_leading_spaces_and_tabs():
    input_str = "   \t   abcdefghijk"
    expected = "abcdefghijk"
    pos = parse_space(input_str, 0, True)
    assert input_str[pos:] == expected


def test_skip_leading_newline_characters_when_newline_ok_true():
    input_str = "\n\n\r\n\r\nabcdefghijk"
    expected = "abcdefghijk"
    pos = parse_space(input_str, 0, True)
    assert input_str[pos:] == expected


def test_not_skip_leading_newline_characters_when_newline_ok_false():
    input_str = "\n\n\r\n\r\nabcdefghijk"
    expected = "\n\n\r\n\r\nabcdefghijk"
    pos = parse_space(input_str, 0, False)
    assert input_str[pos:] == expected


def test_skip_comments_and_leading_spaces():
    input_str = "  # This is a comment\n\t   abcdefghijk"
    expected = "abcdefghijk"
    pos = parse_space(input_str, 0, True)
    assert input_str[pos:] == expected


def test_skip_comments_and_leading_newline_characters_when_newline_ok_true():
    input_str = "\n\n # This is a comment\n\r\n\r\nabcdefghijk"
    expected = "abcdefghijk"
    pos = parse_space(input_str, 0, True)
    assert input_str[pos:] == expected


def test_skip_comments_and_leading_newline_characters_when_newline_ok_false():
    input_str = "\n\n # This is a comment\n\r\n\r\nabcdefghijk"
    expected = "\n\n # This is a comment\n\r\n\r\nabcdefghijk"
    pos = parse_space(input_str, 0, False)
    assert input_str[pos:] == expected


def test_return_empty_string_if_input_all_whitespace_and_comments():
    input_str = "  \t# Comment\n# Another comment\n\n"
    expected = ""
    pos = parse_space(input_str, 0, True)
    assert input_str[pos:] == expected


def test_return_empty_string_for_empty_input_string():
    input_str = ""
    expected = ""
    pos = parse_space(input_str, 0, True)
    assert input_str[pos:] == expected

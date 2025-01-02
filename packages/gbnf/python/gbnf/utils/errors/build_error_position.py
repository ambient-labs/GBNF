MAXIMUM_NUMBER_OF_ERROR_LINES_TO_SHOW = 3


def build_error_position(src: str, pos: int) -> list[str]:
    if src == "":
        return [
            "No input provided",
        ]
    lines = src.split("\n")

    line_idx = 0
    while lines[line_idx] and pos > len(lines[line_idx]) - 1:
        pos -= len(lines[line_idx])
        line_idx += 1

    lines_to_show = [
        lines[i]
        for i in range(
            max(0, line_idx - (MAXIMUM_NUMBER_OF_ERROR_LINES_TO_SHOW - 1)),
            line_idx + 1,
        )
    ]

    return [
        *lines_to_show,
        " " * pos + "^",
    ]

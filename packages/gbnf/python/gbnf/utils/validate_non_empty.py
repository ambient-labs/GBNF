def validate_non_empty(value: list[int]) -> list[int]:
    if not value:
        raise ValueError("Value cannot be empty.")
    return value

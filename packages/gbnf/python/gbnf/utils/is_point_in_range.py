def is_point_in_range(point: int, given_range: tuple[int, int]) -> bool:
    if type(point) is not int:
        raise ValueError("point must be an integer")
    return point >= given_range[0] and point <= given_range[1]

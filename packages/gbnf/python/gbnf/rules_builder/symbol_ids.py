class SymbolIds:
    __map__: dict[str, int]
    __pos__: dict[str, int]
    __reverse_map__: dict[int, str]

    def __init__(self):
        self.__map__ = {}
        self.__pos__ = {}
        self.__reverse_map__ = {}

    def items(self):
        return self.__map__.items()

    def __iter__(self):
        return iter(self.__map__.items())

    def __len__(self):
        return len(self.__map__)

    def __getitem__(self, key):
        return self.__map__[key]

    def set(self, key: str, value: int, pos: int):
        self.__map__[key] = value
        self.__reverse_map__[value] = key
        self.__pos__[key] = pos

    def __contains__(self, key: str):
        return key in self.__map__

    def reverse_get(self, key: int):
        val = self.__reverse_map__.get(key)
        if val is None:
            raise ValueError(f"SymbolIds does not contain value: {key}")
        return val

    def get_pos(self, key: str):
        val = self.__pos__.get(key)
        if val is None:
            raise ValueError(f"SymbolIds does not contain key: {key}")
        return val

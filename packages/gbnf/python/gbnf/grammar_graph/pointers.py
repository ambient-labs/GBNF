from collections import OrderedDict

from .graph_pointer import GraphPointer


class Pointers:
    __pointers__: OrderedDict[int, GraphPointer]

    def __init__(self, *pointers: GraphPointer):
        self.__pointers__ = OrderedDict()
        for pointer in pointers:
            self.add(pointer)

    def __repr__(self):
        return f"<Pointers {id(self)} {[p.node.rule for p in self]}>"

    def add(self, pointer):
        self.__pointers__[pointer.id] = pointer

    def __iter__(self):
        for pointer in self.__pointers__.values():
            yield pointer

    def __len__(self):
        return len(self.__pointers__)

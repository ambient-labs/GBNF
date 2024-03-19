export class SymbolIds {
  // we don't need to delete, just preserve relationships
  #map = new Map<string, number>();
  #pos = new Map<string, number>();
  #reverseMap = new Map<number, string>();

  get size(): number {
    return this.#map.size;
  }

  keys(): IterableIterator<string> {
    return this.#map.keys();
  }

  has(key: string): boolean {
    return this.#map.has(key);
  }

  get(key: string): number {
    const val = this.#map.get(key);
    if (val === undefined) {
      throw new Error(`SymbolIds does not contain key: ${key}`);
    }
    return val;
  }
  reverseGet(key: number): string {
    const val = this.#reverseMap.get(key);
    if (val === undefined) {
      throw new Error(`SymbolIds does not contain value: ${key}`);
    }
    return val;
  }
  getPos(key: string): number {
    const pos = this.#pos.get(key);
    if (pos === undefined) {
      throw new Error(`SymbolIds does not contain key: ${key}`);
    }
    return pos;
  }
  set(key: string, value: number, pos: number): void {
    this.#map.set(key, value);
    this.#pos.set(key, pos);
    this.#reverseMap.set(value, key);
  }

  *[Symbol.iterator](): IterableIterator<[string, number]> {
    yield* this.#map;
  }
}

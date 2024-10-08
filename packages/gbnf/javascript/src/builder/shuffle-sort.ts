export function shuffleSort<T>(arr: T[]): T[] {
  return arr
    .map(value => ({ value, sort: Math.random(), }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value, }) => value);
}

const DEFAULT_FILTER = () => true;
export function getAllPermutations<T>(array: T[], filter: (p: T[], key: string) => boolean = DEFAULT_FILTER, required: string[] = []): T[][] {
  const permutations: T[][] = [];

  function generate(current: T[], remaining: T[]) {
    if (current.length > 0) {
      permutations.push([...current,]);
    }
    for (let i = 0; i < remaining.length; i++) {
      current.push(remaining[i]);
      generate(current, remaining.slice(0, i).concat(remaining.slice(i + 1)));
      current.pop();
    }
  }

  generate([], array);
  if (required.length === 0) {
    return permutations;
  }
  const filteredPermutations = permutations.filter(permutation => {
    let valid = true;
    for (const key of required) {
      if (!filter(permutation, key)) {
        valid = false;
        break;
      }
    }
    return valid;
  });
  return filteredPermutations;
};

export const filterObjectEntry = (permutation: { key?: string }[], key: string): boolean => permutation.some((perm) => perm.key === key);


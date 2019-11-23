export const uniq = <T>(arr: T[]) => Array.from(new Set(arr));

export const countWhere = <T>(arr: T[], predicate: (elem: T) => boolean) =>
  arr.reduce((count, elem) => (predicate(elem) ? count + 1 : count), 0);

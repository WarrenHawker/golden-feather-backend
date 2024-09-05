export const findSimilarStrings = (array1: string[], array2: string[]) => {
  const set2 = new Set(array2);
  const commonStrings = array1.filter((item) => set2.has(item));

  return commonStrings;
};

export const findUniqueStrings = (
  array1: string[] | undefined,
  array2: string[] | undefined
) => {
  if (!array1) {
    throw new Error('array1 cannot be undefined');
  }

  if (!array2) {
    throw new Error('array2 cannot be undefined');
  }

  const set2 = new Set(array2);

  // Filter array1 to find elements that are not in array2 (using the Set)
  const uniqueStrings = array1.filter((item) => !set2.has(item));

  return uniqueStrings;
};

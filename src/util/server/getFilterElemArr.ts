import type { Devfile, FilterElem } from 'custom-types';

/**
 * Generates a sorted FilterElem array based on the specified property
 * The sort is based on the value
 *
 * @param devfiles - the list of devfiles to create the FilterElem
 * @param property - the property to create the FilterElem
 *
 * @returns the sorted FilterElem array
 */
export const getFilterElemArr = (
  devfiles: Devfile[],
  property: keyof Pick<Devfile, 'type' | 'tags' | 'registry' | 'provider'>,
): FilterElem[] => {
  let values = devfiles?.map((devfile) => devfile[property]);

  if (property === 'tags') {
    values = values.flat();
  }

  (values as string[]).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'accent' }));

  const filterElemArr: FilterElem[] = [];
  let prevElem = '';

  for (const currentElem of values as string[]) {
    if (currentElem) {
      if (currentElem !== prevElem) {
        filterElemArr.push({ value: currentElem, state: false, freq: 1 });
      } else {
        filterElemArr[filterElemArr.length - 1].freq++;
      }
      prevElem = currentElem;
    }
  }

  return filterElemArr;
};

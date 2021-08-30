import type { Devfile, FilterElem } from 'custom-types';

export const getFilterElemArr = (
  devfiles: Devfile[],
  property: keyof Pick<Devfile, 'type' | 'tags' | 'sourceRepo'>
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

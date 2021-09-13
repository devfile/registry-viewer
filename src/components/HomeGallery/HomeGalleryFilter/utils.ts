import type { FilterElem } from 'custom-types';

export const getFilterResultCount = (filterElemArr: FilterElem[], searchBarValue: string): number =>
  filterElemArr.filter((filterElem) =>
    filterElem.value.toLowerCase().includes(searchBarValue.toLowerCase())
  ).length;

export const sortFilterDataArr = (providersStateWithFreq: FilterElem[]): FilterElem[] => {
  const copy: FilterElem[] = providersStateWithFreq.sort((a, b) => {
    if (a.state === b.state) {
      return a.value.localeCompare(b.value, 'en', { sensitivity: 'accent' });
    }

    if (a.state && !b.state) {
      return -1;
    }

    return 1;
  });

  return copy;
};

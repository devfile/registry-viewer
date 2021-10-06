import type { FilterElem } from 'custom-types';

export const getFilterElemsActiveCount = (
  filterElems: FilterElem[],
  searchBarValue: string
): number =>
  filterElems.filter((filterElem) =>
    filterElem.value.toLowerCase().includes(searchBarValue.toLowerCase())
  ).length;

export const sortFilterElems = (filterElems: FilterElem[]): FilterElem[] => {
  const copy: FilterElem[] = filterElems.sort((a, b) => {
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

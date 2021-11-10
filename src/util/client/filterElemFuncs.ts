import type { FilterElem } from 'custom-types';

/**
 * Gets the number of active FilterElems for a search bar
 *
 * @param filterElems - the filterElems to count
 * @param searchBarValue - the search bar value
 *
 * @returns number of active FilterElems
 */
export const getFilterElemsActiveCount = (
  filterElems: FilterElem[],
  searchBarValue: string,
): number =>
  filterElems.filter((filterElem) =>
    filterElem.value.toLowerCase().includes(searchBarValue.toLowerCase()),
  ).length;

/**
 * Sorts the filterElems based on state, then by value
 *
 * @param filterElems - the FilterElems to sorts
 *
 * @returns a sorted FilterElem array
 */
export const sortFilterElems = (filterElems: FilterElem[]): FilterElem[] =>
  filterElems.sort((a, b) => {
    if (a.state === b.state) {
      return a.value.localeCompare(b.value, 'en', { sensitivity: 'accent' });
    }

    if (a.state && !b.state) {
      return -1;
    }

    return 1;
  });

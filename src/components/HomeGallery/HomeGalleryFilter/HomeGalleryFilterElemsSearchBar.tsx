import styles from './HomeGalleryFilterElemsSearchBar.module.css';
import type { FilterElem, DefaultProps } from 'custom-types';
import type { Dispatch, SetStateAction } from 'react';
import {
  serializeDataTestid,
  getFilterElemsActiveCount,
  sortFilterElems,
  capitalizeFirstLetter,
} from '@src/util/client';
import { Checkbox, FormGroup, SearchInput } from '@patternfly/react-core';
import { useState, useEffect } from 'react';

export interface HomeGalleryFilterElemsSearchBarProps extends DefaultProps {
  label: string;
  id: string;
  filterElems: FilterElem[];
  setFilterElems: Dispatch<SetStateAction<FilterElem[]>>;
  capitalizeElem?: boolean;
}

export const HomeGalleryFilterElemsSearchBar: React.FC<HomeGalleryFilterElemsSearchBarProps> = ({
  label,
  id,
  filterElems,
  setFilterElems,
  capitalizeElem,
}: HomeGalleryFilterElemsSearchBarProps) => {
  const [searchBarValue, setSearchBarValue] = useState('');

  useEffect(() => {
    setFilterElems(sortFilterElems(filterElems));
  }, [filterElems, setFilterElems]);

  const onCheckboxChange = (checked: boolean, event: React.FormEvent<HTMLInputElement>): void => {
    const target: EventTarget = event.target;
    const state: boolean = (target as HTMLInputElement).checked;
    const value: string = (target as HTMLInputElement).name;

    const copyFilterElems = filterElems.map((filterElem) => {
      if (filterElem.value === value) {
        filterElem.state = state;
      }
      return filterElem;
    });

    setFilterElems(copyFilterElems);
  };

  const onSearchChange = (value: string): void => {
    setSearchBarValue(value);
  };

  return (
    <FormGroup fieldId={`${id}-selector`} label={label} hasNoPaddingTop>
      {filterElems.length > 1 && (
        <SearchInput
          className={styles.formGroupElement}
          data-testid={`search-bar-${id}`}
          placeholder={`Search by ${id} name`}
          value={searchBarValue}
          onChange={onSearchChange}
          onClear={(): void => onSearchChange('')}
          resultsCount={getFilterElemsActiveCount(filterElems, searchBarValue)}
        />
      )}
      <div className={styles.box}>
        {filterElems
          .filter((filterElem) =>
            filterElem.value.toLowerCase().includes(searchBarValue.toLowerCase()),
          )
          .map((filterElem) => (
            <div key={filterElem.value} className={styles.formGroupElement}>
              <Checkbox
                data-testid={`${id}-${serializeDataTestid(filterElem.value)}`}
                isChecked={filterElem.state}
                onChange={onCheckboxChange}
                id={`types-${filterElem.value}`}
                label={`${
                  capitalizeElem ? capitalizeFirstLetter(filterElem.value) : filterElem.value
                } (${filterElem.freq})`}
                name={filterElem.value}
              />
            </div>
          ))}
      </div>
    </FormGroup>
  );
};
HomeGalleryFilterElemsSearchBar.displayName = 'HomeGalleryFilterElemsSearchBar';

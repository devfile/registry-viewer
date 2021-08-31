import styles from './HomeGalleryFilterTags.module.css';
import type { FilterElem } from 'custom-types';
import type { Dispatch, SetStateAction } from 'react';
import { serializeDataTestid } from '@src/util/client';
import { Checkbox, FormGroup, SearchInput } from '@patternfly/react-core';
import { useState, useEffect } from 'react';

export interface HomeGalleryFilterTagsProps {
  tagFilterElems: FilterElem[];
  setTagFilterElems: Dispatch<SetStateAction<FilterElem[]>>;
}

export const HomeGalleryFilterTags: React.FC<HomeGalleryFilterTagsProps> = ({
  tagFilterElems,
  setTagFilterElems
}: HomeGalleryFilterTagsProps) => {
  const [tagSearchBarValue, setTagSearchBarValue] = useState('');

  useEffect(() => {
    setTagFilterElems(sortFilterDataArr(tagFilterElems));
  }, [tagFilterElems]);

  const onCheckboxTagsChange = (
    checked: boolean,
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const target: EventTarget = event.target;
    const state: boolean = (target as HTMLInputElement).checked;
    const value: string = (target as HTMLInputElement).name;

    const index: number = tagFilterElems.findIndex((elem) => elem.value === value);

    const copy: FilterElem[] = [...tagFilterElems];
    copy[index].state = state;
    setTagFilterElems(copy);
  };

  const onSearchChange = (value: string): void => {
    setTagSearchBarValue(value);
  };

  return (
    <FormGroup fieldId="tag-selector" label="Tags" hasNoPaddingTop>
      {tagFilterElems.length > 1 && (
        <SearchInput
          className={styles.formGroupElement}
          data-testid="search-bar-tag"
          placeholder="Search by tag name"
          value={tagSearchBarValue}
          onChange={onSearchChange}
          onClear={(): void => onSearchChange('')}
          resultsCount={getFilterResultCount(tagFilterElems, tagSearchBarValue)}
        />
      )}
      <div className={styles.tagBox}>
        {tagFilterElems
          .filter((tag) => tag.value.toLowerCase().includes(tagSearchBarValue.toLowerCase()))
          .map((tag) => (
            <div key={tag.value} className={styles.formGroupElement}>
              <Checkbox
                data-testid={`tag-${serializeDataTestid(tag.value)}`}
                isChecked={tag.state}
                onChange={onCheckboxTagsChange}
                id={`types-${tag.value}`}
                label={`${tag.value} (${tag.freq})`}
                name={tag.value}
              />
            </div>
          ))}
      </div>
    </FormGroup>
  );
};
HomeGalleryFilterTags.displayName = 'HomeGalleryFilterTags';

export const getFilterResultCount = (filterElemArr: FilterElem[], searchBarValue: string): number =>
  filterElemArr.filter((filterElem) =>
    filterElem.value.toLowerCase().includes(searchBarValue.toLowerCase())
  ).length;

export const sortFilterDataArr = (tagsStateWithFreq: FilterElem[]): FilterElem[] => {
  const copy: FilterElem[] = tagsStateWithFreq.sort((a, b) => {
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

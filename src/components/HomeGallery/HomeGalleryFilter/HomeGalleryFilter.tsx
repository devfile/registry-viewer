import styles from './HomeGalleryFilter.module.css';
import type { FilterElem } from 'custom-types';
import type { Dispatch, SetStateAction } from 'react';
import { capitalizeFirstLetter, serializeDataTestid } from '@src/util/client';
import {
  Checkbox,
  Form,
  FormGroup,
  SearchInput,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import { useState, useEffect } from 'react';

export interface HomeGalleryFilterProps {
  tagFilterElems: FilterElem[];
  typeFilterElems: FilterElem[];
  sourceRepoFilterElems: FilterElem[];
  setTagFilterElems: Dispatch<SetStateAction<FilterElem[]>>;
  setTypeFilterElems: Dispatch<SetStateAction<FilterElem[]>>;
  setSourceRepoFilterElems: Dispatch<SetStateAction<FilterElem[]>>;
}

/**
 * Renders a {@link HomeGalleryFilter} React component.
 * Adds a type and tag filter for devfiles
 * @returns `<DevfileFilter tagsStateWithFreq={tagsStateWithFreq} typesStateWithFreq={typesStateWithFreq} setTagsStateWithFreq={setTagsStateWithFreq} setTypesStateWithFreq={setTypesStateWithFreq}/>`
 */
export const HomeGalleryFilter: React.FC<HomeGalleryFilterProps> = ({
  tagFilterElems,
  typeFilterElems,
  sourceRepoFilterElems,
  setTagFilterElems,
  setTypeFilterElems,
  setSourceRepoFilterElems
}: HomeGalleryFilterProps) => {
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

  const onCheckboxTypesChange = (
    checked: boolean,
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const target: EventTarget = event.target;
    const state: boolean = (target as HTMLInputElement).checked;
    const value: string = (target as HTMLInputElement).name;

    const index: number = typeFilterElems.findIndex((elem) => elem.value === value);

    const copy: FilterElem[] = [...typeFilterElems];
    copy[index].state = state;
    setTypeFilterElems(copy);
  };

  const onCheckboxSourceRepoChange = (
    checked: boolean,
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const target: EventTarget = event.target;
    const state: boolean = (target as HTMLInputElement).checked;
    const value: string = (target as HTMLInputElement).name;

    const index: number = sourceRepoFilterElems.findIndex((elem) => elem.value === value);

    const copy: FilterElem[] = [...sourceRepoFilterElems];
    copy[index].state = state;
    setSourceRepoFilterElems(copy);
  };

  const onSearchChange = (value: string): void => {
    setTagSearchBarValue(value);
  };

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h2}>Filters</Text>
      </TextContent>
      <Form>
        {sourceRepoFilterElems.length > 1 && (
          <FormGroup fieldId="source-repo-selector" label="Source Repositories" hasNoPaddingTop>
            {sourceRepoFilterElems.map((sourceRepo) => (
              <div key={sourceRepo.value} className={styles.formGroupElement}>
                <Checkbox
                  data-testid={`source-repo-${serializeDataTestid(sourceRepo.value)}`}
                  isChecked={sourceRepo.state}
                  onChange={onCheckboxSourceRepoChange}
                  id={`source-repo-${sourceRepo.value}`}
                  label={`${sourceRepo.value} (${sourceRepo.freq})`}
                  name={sourceRepo.value}
                />
              </div>
            ))}
          </FormGroup>
        )}
        {typeFilterElems.length > 1 && (
          <FormGroup fieldId="type-selector" label="Types" hasNoPaddingTop>
            {typeFilterElems.map((type) => (
              <div key={type.value} className={styles.formGroupElement}>
                <Checkbox
                  data-testid={`type-${serializeDataTestid(type.value)}`}
                  isChecked={type.state}
                  onChange={onCheckboxTypesChange}
                  id={`types-${type.value}`}
                  label={`${capitalizeFirstLetter(type.value)} (${type.freq})`}
                  name={type.value}
                />
              </div>
            ))}
          </FormGroup>
        )}
        {tagFilterElems.length > 1 && (
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
        )}
      </Form>
    </>
  );
};

const sortFilterDataArr = (tagsStateWithFreq: FilterElem[]): FilterElem[] => {
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
HomeGalleryFilter.displayName = 'HomeGalleryFilter';

const getFilterResultCount = (filterElemArr: FilterElem[], searchBarValue: string): number =>
  filterElemArr.filter((filterElem) =>
    filterElem.value.toLowerCase().includes(searchBarValue.toLowerCase())
  ).length;

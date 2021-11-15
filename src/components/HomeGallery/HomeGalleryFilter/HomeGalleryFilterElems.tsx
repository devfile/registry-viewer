import styles from './HomeGalleryFilterElems.module.css';
import type { FilterElem, DefaultProps } from 'custom-types';
import type { Dispatch, SetStateAction } from 'react';
import { serializeDataTestid, capitalizeFirstLetter } from '@src/util/client';
import { Checkbox, FormGroup } from '@patternfly/react-core';

export interface HomeGalleryFilterElemsProps extends DefaultProps {
  label: string;
  id: string;
  filterElems: FilterElem[];
  setFilterElems: Dispatch<SetStateAction<FilterElem[]>>;
  capitalizeElem?: boolean;
}

export const HomeGalleryFilterElems: React.FC<HomeGalleryFilterElemsProps> = ({
  label,
  id,
  filterElems,
  setFilterElems,
  capitalizeElem,
}: HomeGalleryFilterElemsProps) => {
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

  return (
    <FormGroup fieldId={`${id}-selector`} label={label} hasNoPaddingTop>
      {filterElems.map((filterElem) => (
        <div key={filterElem.value} className={styles.formGroupElement}>
          <Checkbox
            data-testid={`${id}-${serializeDataTestid(filterElem.value)}`}
            isChecked={filterElem.state}
            onChange={onCheckboxChange}
            id={`${id}-${filterElem.value}`}
            label={`${
              capitalizeElem ? capitalizeFirstLetter(filterElem.value) : filterElem.value
            } (${filterElem.freq})`}
            name={filterElem.value}
          />
        </div>
      ))}
    </FormGroup>
  );
};
HomeGalleryFilterElems.displayName = 'HomeGalleryFilterElems';

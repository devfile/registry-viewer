import styles from './HomeGalleryFilterTypes.module.css';
import type { FilterElem } from 'custom-types';
import type { Dispatch, SetStateAction } from 'react';
import { capitalizeFirstLetter, serializeDataTestid } from '@src/util/client';
import { Checkbox, FormGroup } from '@patternfly/react-core';

export interface HomeGalleryFilterTypesProps {
  typeFilterElems: FilterElem[];
  setTypeFilterElems: Dispatch<SetStateAction<FilterElem[]>>;
}

export const HomeGalleryFilterTypes: React.FC<HomeGalleryFilterTypesProps> = ({
  typeFilterElems,
  setTypeFilterElems
}: HomeGalleryFilterTypesProps) => {
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

  return (
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
  );
};
HomeGalleryFilterTypes.displayName = 'HomeGalleryFilterTypes';

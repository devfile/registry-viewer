import styles from './HomeGalleryFilterSourceRepo.module.css';
import type { FilterElem } from 'custom-types';
import type { Dispatch, SetStateAction } from 'react';
import { serializeDataTestid } from '@src/util/client';
import { Checkbox, FormGroup } from '@patternfly/react-core';

export interface HomeGalleryFilterSourceRepoProps {
  sourceRepoFilterElems: FilterElem[];
  setSourceRepoFilterElems: Dispatch<SetStateAction<FilterElem[]>>;
}

export const HomeGalleryFilterSourceRepo: React.FC<HomeGalleryFilterSourceRepoProps> = ({
  sourceRepoFilterElems,
  setSourceRepoFilterElems
}: HomeGalleryFilterSourceRepoProps) => {
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

  return (
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
  );
};
HomeGalleryFilterSourceRepo.displayName = 'HomeGalleryFilterSourceRepo';

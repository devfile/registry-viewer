import styles from './HomeGalleryFilterProviders.module.css';
import type { FilterElem } from 'custom-types';
import type { Dispatch, SetStateAction } from 'react';
import { serializeDataTestid } from '@src/util/client';
import { Checkbox, FormGroup, SearchInput } from '@patternfly/react-core';
import { useState, useEffect } from 'react';
import { getFilterResultCount, sortFilterDataArr } from './utils';

export interface HomeGalleryFilterProvidersProps {
  providerFilterElems: FilterElem[];
  setProviderFilterElems: Dispatch<SetStateAction<FilterElem[]>>;
}

export const HomeGalleryFilterProviders: React.FC<HomeGalleryFilterProvidersProps> = ({
  providerFilterElems,
  setProviderFilterElems
}: HomeGalleryFilterProvidersProps) => {
  const [providerSearchBarValue, setProviderSearchBarValue] = useState('');

  useEffect(() => {
    setProviderFilterElems(sortFilterDataArr(providerFilterElems));
  }, [providerFilterElems]);

  const onCheckboxProvidersChange = (
    checked: boolean,
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const target: EventTarget = event.target;
    const state: boolean = (target as HTMLInputElement).checked;
    const value: string = (target as HTMLInputElement).name;

    const index: number = providerFilterElems.findIndex((elem) => elem.value === value);

    const copy: FilterElem[] = [...providerFilterElems];
    copy[index].state = state;
    setProviderFilterElems(copy);
  };

  const onSearchChange = (value: string): void => {
    setProviderSearchBarValue(value);
  };

  return (
    <FormGroup fieldId="provider-selector" label="Providers" hasNoPaddingTop>
      {providerFilterElems.length > 1 && (
        <SearchInput
          className={styles.formGroupElement}
          data-testid="search-bar-provider"
          placeholder="Search by provider name"
          value={providerSearchBarValue}
          onChange={onSearchChange}
          onClear={(): void => onSearchChange('')}
          resultsCount={getFilterResultCount(providerFilterElems, providerSearchBarValue)}
        />
      )}
      <div className={styles.providerBox}>
        {providerFilterElems
          .filter((provider) =>
            provider.value.toLowerCase().includes(providerSearchBarValue.toLowerCase())
          )
          .map((provider) => (
            <div key={provider.value} className={styles.formGroupElement}>
              <Checkbox
                data-testid={`provider-${serializeDataTestid(provider.value)}`}
                isChecked={provider.state}
                onChange={onCheckboxProvidersChange}
                id={`types-${provider.value}`}
                label={`${provider.value} (${provider.freq})`}
                name={provider.value}
              />
            </div>
          ))}
      </div>
    </FormGroup>
  );
};
HomeGalleryFilterProviders.displayName = 'HomeGalleryFilterProviders';

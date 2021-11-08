import type { FilterElem, DefaultProps } from 'custom-types';
import { HomeGalleryFilterElemsSearchBar, HomeGalleryFilterElems } from '@src/components';
import type { Dispatch, SetStateAction } from 'react';
import { Form, Text, TextContent, TextVariants } from '@patternfly/react-core';

export interface HomeGalleryFilterProps extends DefaultProps {
  tagFilterElems: FilterElem[];
  typeFilterElems: FilterElem[];
  registryFilterElems: FilterElem[];
  providerFilterElems: FilterElem[];
  setTagFilterElems: Dispatch<SetStateAction<FilterElem[]>>;
  setTypeFilterElems: Dispatch<SetStateAction<FilterElem[]>>;
  setRegistryFilterElems: Dispatch<SetStateAction<FilterElem[]>>;
  setProviderFilterElems: Dispatch<SetStateAction<FilterElem[]>>;
}

/**
 * Renders a {@link HomeGalleryFilter} React component.
 * Adds a type and tag filter for devfiles
 * @returns `<DevfileFilter tagsStateWithFreq={tagsStateWithFreq} typesStateWithFreq={typesStateWithFreq} setTagsStateWithFreq={setTagsStateWithFreq} setTypesStateWithFreq={setTypesStateWithFreq}/>`
 */
export const HomeGalleryFilter: React.FC<HomeGalleryFilterProps> = ({
  tagFilterElems,
  typeFilterElems,
  registryFilterElems,
  providerFilterElems,
  setTagFilterElems,
  setTypeFilterElems,
  setRegistryFilterElems,
  setProviderFilterElems,
}: HomeGalleryFilterProps) => (
  <>
    <TextContent>
      <Text component={TextVariants.h2}>Filters</Text>
    </TextContent>
    <Form>
      {registryFilterElems.length > 1 && (
        <HomeGalleryFilterElems
          label="Repositories"
          id="registry"
          filterElems={registryFilterElems}
          setFilterElems={setRegistryFilterElems}
        />
      )}
      {typeFilterElems.length > 1 && (
        <HomeGalleryFilterElems
          label="Types"
          id="type"
          filterElems={typeFilterElems}
          setFilterElems={setTypeFilterElems}
          capitalizeElem={true}
        />
      )}
      {providerFilterElems.length > 1 && (
        <HomeGalleryFilterElems
          label="Providers"
          id="provider"
          filterElems={providerFilterElems}
          setFilterElems={setProviderFilterElems}
        />
      )}
      {tagFilterElems.length > 1 && (
        <HomeGalleryFilterElemsSearchBar
          label="Tags"
          id="tag"
          filterElems={tagFilterElems}
          setFilterElems={setTagFilterElems}
        />
      )}
    </Form>
  </>
);
HomeGalleryFilter.displayName = 'HomeGalleryFilter';

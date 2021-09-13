import type { FilterElem } from 'custom-types';
import {
  HomeGalleryFilterSourceRepo,
  HomeGalleryFilterTags,
  HomeGalleryFilterTypes
} from '@src/components';
import type { Dispatch, SetStateAction } from 'react';
import { Form, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { HomeGalleryFilterProviders } from './HomeGalleryFilterProviders';

export interface HomeGalleryFilterProps {
  tagFilterElems: FilterElem[];
  typeFilterElems: FilterElem[];
  sourceRepoFilterElems: FilterElem[];
  providerFilterElems: FilterElem[];
  setTagFilterElems: Dispatch<SetStateAction<FilterElem[]>>;
  setTypeFilterElems: Dispatch<SetStateAction<FilterElem[]>>;
  setSourceRepoFilterElems: Dispatch<SetStateAction<FilterElem[]>>;
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
  sourceRepoFilterElems,
  providerFilterElems,
  setTagFilterElems,
  setTypeFilterElems,
  setSourceRepoFilterElems,
  setProviderFilterElems
}: HomeGalleryFilterProps) => (
  <>
    <TextContent>
      <Text component={TextVariants.h2}>Filters</Text>
    </TextContent>
    <Form>
      {sourceRepoFilterElems.length > 1 && (
        <HomeGalleryFilterSourceRepo
          sourceRepoFilterElems={sourceRepoFilterElems}
          setSourceRepoFilterElems={setSourceRepoFilterElems}
        />
      )}
      {typeFilterElems.length > 1 && (
        <HomeGalleryFilterTypes
          typeFilterElems={typeFilterElems}
          setTypeFilterElems={setTypeFilterElems}
        />
      )}
      {tagFilterElems.length > 1 && (
        <HomeGalleryFilterTags
          tagFilterElems={tagFilterElems}
          setTagFilterElems={setTagFilterElems}
        />
      )}
      {providerFilterElems.length > 1 && (
        <HomeGalleryFilterProviders
          providerFilterElems={providerFilterElems}
          setProviderFilterElems={setProviderFilterElems}
        />
      )}
    </Form>
  </>
);
HomeGalleryFilter.displayName = 'HomeGalleryFilter';

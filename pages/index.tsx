import type { Devfile, FilterElem } from 'custom-types';
import { getDevfileRegistryJSON, getFilterElemArr } from '@src/util/server';
import {
  HomeGalleryFilter,
  HomeGalleryGrid,
  HomeGallerySearchBar,
  ErrorBanner
} from '@src/components';
import { InferGetStaticPropsType, GetStaticProps } from 'next';
import { useState, useEffect } from 'react';
import { Grid, GridItem } from '@patternfly/react-core';

/**
 * Renders the {@link HomePage}
 */
const HomePage: React.FC<InferGetStaticPropsType<GetStaticProps>> = ({
  devfiles,
  tags,
  types,
  sourceRepos,
  providers,
  errors
}: InferGetStaticPropsType<GetStaticProps>) => {
  const [searchBarValue, setSearchBarValue] = useState<string>('');
  const [filteredDevfiles, setFilteredDevfiles] = useState<Devfile[]>(devfiles);

  const [tagFilterElems, setTagFilterElems] = useState<FilterElem[]>(tags);
  const [typeFilterElems, setTypeFilterElems] = useState<FilterElem[]>(types);
  const [sourceRepoFilterElems, setSourceRepoFilterElems] = useState<FilterElem[]>(sourceRepos);
  const [providerFilterElems, setProviderFilterElems] = useState<FilterElem[]>(providers);

  useEffect(() => {
    let filteredDevfiles = filterDevfilesOnSearchBar(devfiles, searchBarValue);
    filteredDevfiles = filterDevfilesOn('tags', filteredDevfiles, tagFilterElems);
    filteredDevfiles = filterDevfilesOn('type', filteredDevfiles, typeFilterElems);
    filteredDevfiles = filterDevfilesOn('sourceRepo', filteredDevfiles, sourceRepoFilterElems);
    filteredDevfiles = filterDevfilesOn('provider', filteredDevfiles, providerFilterElems);

    setFilteredDevfiles(filteredDevfiles);
  }, [tagFilterElems, typeFilterElems, sourceRepoFilterElems, providerFilterElems, searchBarValue]);

  const onSearchBarChange = (value: string): void => {
    setSearchBarValue(value);
  };

  return (
    <>
      <ErrorBanner errors={errors} />
      <Grid hasGutter>
        <GridItem xl2={2} xl={3} lg={4} md={6} sm={12} span={12}>
          <HomeGalleryFilter
            tagFilterElems={tagFilterElems}
            typeFilterElems={typeFilterElems}
            sourceRepoFilterElems={sourceRepoFilterElems}
            providerFilterElems={providerFilterElems}
            setTagFilterElems={setTagFilterElems}
            setTypeFilterElems={setTypeFilterElems}
            setSourceRepoFilterElems={setSourceRepoFilterElems}
            setProviderFilterElems={setProviderFilterElems}
          />
        </GridItem>
        <GridItem xl2={10} xl={9} lg={8} md={6} sm={12} span={12}>
          <HomeGallerySearchBar
            devfileCount={filteredDevfiles.length}
            onSearchBarChange={onSearchBarChange}
            searchBarValue={searchBarValue}
          />
          <HomeGalleryGrid
            devfiles={filteredDevfiles}
            sourceRepos={sourceRepos}
            providers={providers}
          />
        </GridItem>
      </Grid>
    </>
  );
};

const isSearchBarValueIn = (value: string | undefined, searchBarValue: string): boolean =>
  !!value?.toLowerCase().includes(searchBarValue.toLowerCase());

const isSearchBarValueInTag = (tags: string[] | undefined, searchBarValue: string): boolean =>
  !!tags?.some((tag) => tag.toLowerCase().includes(searchBarValue.toLowerCase()));

const filterDevfilesOnSearchBar = (devfiles: Devfile[], searchBarValue: string): Devfile[] => {
  if (searchBarValue === '') {
    return devfiles;
  }

  const devfilesFilteredOnSearchBar: Devfile[] = devfiles.filter((devfile: Devfile) => {
    if (isSearchBarValueIn(devfile.displayName, searchBarValue)) {
      return true;
    }

    if (isSearchBarValueIn(devfile.description, searchBarValue)) {
      return true;
    }

    if (isSearchBarValueIn(devfile.provider, searchBarValue)) {
      return true;
    }

    return isSearchBarValueInTag(devfile.tags, searchBarValue);
  });
  return devfilesFilteredOnSearchBar;
};

const filterDevfilesOn = (
  key: keyof Omit<Devfile, 'links' | 'git'>,
  devfiles: Devfile[],
  filterElems: FilterElem[]
): Devfile[] => {
  const filterElemsSelectedByUser: FilterElem[] = filterElems.filter(
    (filterElem) => filterElem.state
  );

  if (!filterElemsSelectedByUser.length) {
    return devfiles;
  }

  let devfilesFilteredOn: Devfile[] = [];

  /**
   * Check if the key results in a string or string array
   */
  if (Array.isArray(devfiles[0][key])) {
    devfilesFilteredOn = devfiles.filter((devfile: Devfile) =>
      (devfile[key] as string[])?.some((keyValue) =>
        filterElemsSelectedByUser.some(
          (kayValuesSelectedByUser) => keyValue === kayValuesSelectedByUser.value
        )
      )
    );
  } else {
    devfilesFilteredOn = devfiles.filter((devfile: Devfile) =>
      filterElemsSelectedByUser.some((filterElem) => (devfile[key] as string) === filterElem.value)
    );
  }

  return devfilesFilteredOn;
};

export const getStaticProps: GetStaticProps = async () => {
  const [unsortedDevfiles, errors] = await getDevfileRegistryJSON();

  const devfiles = unsortedDevfiles.sort((a, b) =>
    a.displayName.localeCompare(b.displayName, 'en', {
      sensitivity: 'accent'
    })
  );

  const tags = getFilterElemArr(devfiles, 'tags');
  const types = getFilterElemArr(devfiles, 'type');
  const sourceRepos = getFilterElemArr(devfiles, 'sourceRepo');
  const providers = getFilterElemArr(devfiles, 'provider');

  return {
    props: {
      devfiles,
      tags,
      types,
      sourceRepos,
      providers,
      errors
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 15 seconds
    revalidate: 15
  };
};

export default HomePage;

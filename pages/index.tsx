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
    filteredDevfiles = filterDevfilesOnTags(filteredDevfiles, tagFilterElems);
    filteredDevfiles = filterDevfilesOnTypes(filteredDevfiles, typeFilterElems);
    filteredDevfiles = filterDevfilesOnSourceRepos(filteredDevfiles, sourceRepoFilterElems);
    filteredDevfiles = filterDevfilesOnProviders(filteredDevfiles, providerFilterElems);

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

    if (devfile.provider && isSearchBarValueIn(devfile.provider, searchBarValue)) {
      return true;
    }

    return isSearchBarValueInTag(devfile.tags, searchBarValue);
  });
  return devfilesFilteredOnSearchBar;
};

const filterDevfilesOnTags = (devfiles: Devfile[], tagFilterElems: FilterElem[]): Devfile[] => {
  const tagsSelectedByUser: FilterElem[] = tagFilterElems.filter((tag) => tag.state);

  if (!tagsSelectedByUser.length) {
    return devfiles;
  }

  const devfilesFilteredOnTags: Devfile[] = devfiles.filter((devfile: Devfile) =>
    devfile.tags?.some((tag) =>
      tagsSelectedByUser.some((tagSelectedByUser) => tag === tagSelectedByUser.value)
    )
  );
  return devfilesFilteredOnTags;
};

const filterDevfilesOnProviders = (
  devfiles: Devfile[],
  providerFilterElems: FilterElem[]
): Devfile[] => {
  const providersSelectedByUser: FilterElem[] = providerFilterElems.filter(
    (provider) => provider.state
  );

  if (!providersSelectedByUser.length) {
    return devfiles;
  }

  const devfilesFilteredOnProviders: Devfile[] = devfiles.filter((devfile: Devfile) =>
    providersSelectedByUser.some((provider) => devfile.provider === provider.value)
  );
  return devfilesFilteredOnProviders;
};

const filterDevfilesOnTypes = (devfiles: Devfile[], typeFilterElems: FilterElem[]): Devfile[] => {
  const typesSelectedByUser: FilterElem[] = typeFilterElems.filter((type) => type.state);

  if (!typesSelectedByUser.length) {
    return devfiles;
  }

  const devfilesFilteredOnTypes: Devfile[] = devfiles.filter((devfile: Devfile) =>
    typesSelectedByUser.some((type) => devfile.type === type.value)
  );
  return devfilesFilteredOnTypes;
};

const filterDevfilesOnSourceRepos = (
  devfiles: Devfile[],
  sourceRepoFilterElems: FilterElem[]
): Devfile[] => {
  const sourceReposSelectedByUser: FilterElem[] = sourceRepoFilterElems.filter(
    (sourceRepo) => sourceRepo.state
  );

  if (!sourceReposSelectedByUser.length) {
    return devfiles;
  }

  const devfilesFilteredOnSourceRepos: Devfile[] = devfiles.filter((devfile: Devfile) =>
    sourceReposSelectedByUser.some((sourceRepo) => devfile.sourceRepo === sourceRepo.value)
  );
  return devfilesFilteredOnSourceRepos;
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

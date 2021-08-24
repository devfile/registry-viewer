import type { Devfile, FilterElem } from 'custom-types';
import { getMetadataOfDevfiles } from '@src/util/server';
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
  errors
}: InferGetStaticPropsType<GetStaticProps>) => {
  const [searchBarValue, setSearchBarValue] = useState<string>('');
  const [filteredDevfiles, setFilteredDevfiles] = useState<Devfile[]>(devfiles);

  const [tagsStateWithFreq, setTagsStateWithFreq] = useState<FilterElem[]>(tags);
  const [typesStateWithFreq, setTypesStateWithFreq] = useState<FilterElem[]>(types);

  useEffect(() => {
    let filteredDevfiles = filterDevfilesOnSearchBar(devfiles, searchBarValue);
    filteredDevfiles = filterDevfilesOnTags(filteredDevfiles, tagsStateWithFreq);
    filteredDevfiles = filterDevfilesOnTypes(filteredDevfiles, typesStateWithFreq);

    setFilteredDevfiles(filteredDevfiles);
  }, [tagsStateWithFreq, typesStateWithFreq, searchBarValue]);

  const onSearchBarChange = (value: string): void => {
    setSearchBarValue(value);
  };

  return (
    <>
      <ErrorBanner errors={errors} />
      <Grid hasGutter>
        <GridItem xl2={2} xl={3} lg={4} md={6} sm={12} span={12}>
          <HomeGalleryFilter
            tagsStateWithFreq={tagsStateWithFreq}
            typesStateWithFreq={typesStateWithFreq}
            setTagsStateWithFreq={setTagsStateWithFreq}
            setTypesStateWithFreq={setTypesStateWithFreq}
          />
        </GridItem>
        <GridItem xl2={10} xl={9} lg={8} md={6} sm={12} span={12}>
          <HomeGallerySearchBar
            devfileCount={filteredDevfiles.length}
            onSearchBarChange={onSearchBarChange}
            searchBarValue={searchBarValue}
          />
          <HomeGalleryGrid devfiles={filteredDevfiles} sourceRepos={sourceRepos} />
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

    return isSearchBarValueInTag(devfile.tags, searchBarValue);
  });
  return devfilesFilteredOnSearchBar;
};

const filterDevfilesOnTags = (devfiles: Devfile[], tagsStateWithFreq: FilterElem[]): Devfile[] => {
  const tagsSelectedByUser: FilterElem[] = tagsStateWithFreq.filter((tag) => tag.state);

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

const filterDevfilesOnTypes = (
  devfiles: Devfile[],
  typesStateWithFreq: FilterElem[]
): Devfile[] => {
  const typesSelectedByUser: FilterElem[] = typesStateWithFreq.filter((type) => type.state);

  if (!typesSelectedByUser.length) {
    return devfiles;
  }

  const devfilesFilteredOnTypes: Devfile[] = devfiles.filter((devfile: Devfile) =>
    typesSelectedByUser.some((typeSelectedByUser) => devfile.type === typeSelectedByUser.value)
  );
  return devfilesFilteredOnTypes;
};

const getStateAndStringFreq = (array: string[]): FilterElem[] => {
  array.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'accent' }));

  const filterElemArr: FilterElem[] = [];
  let prevElem = '';

  for (const currentElem of array) {
    if (currentElem) {
      if (currentElem !== prevElem) {
        filterElemArr.push({ value: currentElem, state: false, freq: 1 });
      } else {
        filterElemArr[filterElemArr.length - 1].freq++;
      }
      prevElem = currentElem;
    }
  }

  return filterElemArr;
};

const getTagsStateWithFreq = (devfiles: Devfile[]): FilterElem[] => {
  const tagValues = devfiles?.map((devfile) => devfile?.tags).flat() as string[];

  const tagsStateWithFreq = getStateAndStringFreq(tagValues);

  return tagsStateWithFreq;
};

const getTypesStateWithFreq = (devfiles: Devfile[]): FilterElem[] => {
  const typeValues = devfiles?.map((devfile) => devfile.type);

  const tagsStateWithFreq = getStateAndStringFreq(typeValues);

  return tagsStateWithFreq;
};

const getSourceReposStateWithFreq = (devfiles: Devfile[]): FilterElem[] => {
  const sourceRepoValues = devfiles?.map((devfile) => devfile.sourceRepo);

  const sourceReposStateWithFreq = getStateAndStringFreq(sourceRepoValues);

  return sourceReposStateWithFreq;
};

export const getStaticProps: GetStaticProps = async () => {
  const [unsortedDevfiles, errors] = await getMetadataOfDevfiles();

  const devfiles = unsortedDevfiles.sort((a, b) =>
    a.displayName.localeCompare(b.displayName, 'en', {
      sensitivity: 'accent'
    })
  );

  const tags = getTagsStateWithFreq(devfiles);
  const types = getTypesStateWithFreq(devfiles);
  const sourceRepos = getSourceReposStateWithFreq(devfiles);

  return {
    props: {
      devfiles,
      tags,
      types,
      sourceRepos,
      errors
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 15 seconds
    revalidate: 15
  };
};

export default HomePage;

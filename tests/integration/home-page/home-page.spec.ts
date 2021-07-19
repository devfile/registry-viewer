// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />

import type { Devfile, FilterElem } from 'custom-types';

describe('Pretests', () => {
  it('Verify webpage is running', () => {
    cy.visit('http://localhost:3000/');
  });
});

describe('Home page tests on desktop', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:3000/');
  });

  it('Devfile search bar', () => {
    cy.getDevfiles((devfiles: Devfile[]) => {
      cy.compareCardLength(devfiles.length);

      const textArr: string[] = ['JavA', 'rhel', 'PYTHON', 'vERT.x'];

      textArr.forEach((text) => {
        cy.get('[data-test-id=search-bar-devfile]').type(`{selectall}{backspace}${text}`);
        cy.compareCardLength(filterDevfilesOnSearchBar(devfiles, text).length);
      });
    });
  });

  it('Clickability of each devfile', () => {
    cy.getDevfiles((devfiles: Devfile[]) => {
      devfiles.forEach((devfile) => {
        cy.get(`[data-test-id=card-${devfile.name.replace(/\.| /g, '')}]`).click();
        cy.get('[data-test-id=go-home-button').click();
      });
    });
  });

  it('Type filter', () => {
    cy.getDevfiles((devfiles: Devfile[]) => {
      const typesStateWithFreq: FilterElem[] = getTypesStateWithFreq(devfiles);

      cy.iterateThroughFilter('type', typesStateWithFreq, (selectedTypes) => {
        cy.compareCardLength(filterDevfilesOnTypes(devfiles, selectedTypes).length);
      });
    });
  });

  it('Tag filter', () => {
    cy.getDevfiles((devfiles: Devfile[]) => {
      const tagsStateWithFreq: FilterElem[] = getTagsStateWithFreq(devfiles);

      cy.iterateThroughFilter('tag', tagsStateWithFreq, (selectedTags) => {
        cy.compareCardLength(filterDevfilesOnTags(devfiles, selectedTags).length);
      });
    });
  });

  it('Tag filter search bar', () => {
    cy.getDevfiles((devfiles: Devfile[]) => {
      const tagsStateWithFreq: FilterElem[] = getTagsStateWithFreq(devfiles);

      const textArr: string[] = ['JavA', 'rhel', 'PYTHON', 'vERT.x'];

      textArr.forEach((text) => {
        cy.get('[data-test-id=search-bar-tag]').type(`{selectall}{backspace}${text}`);
        cy.get('[data-test-id^=tag-]').should(
          'have.length',
          tagsStateWithFreq.filter((tagData) =>
            tagData.value.toLowerCase().includes(text.toLowerCase())
          ).length
        );
      });
    });
  });
});

const isSearchBarValueIn = (value: string | undefined, searchBarValue: string) =>
  value?.toLowerCase().includes(searchBarValue.toLowerCase());

const isSearchBarValueInTag = (tags: string[] | undefined, searchBarValue: string) =>
  tags?.some((tag) => tag.toLowerCase().includes(searchBarValue.toLowerCase()));

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
  const devfilesFilteredOnTags: Devfile[] = devfiles.filter((devfile: Devfile) =>
    devfile.tags?.some((tag) =>
      tagsStateWithFreq.some((tagStateWithFreq) => tag === tagStateWithFreq.value)
    )
  );
  return devfilesFilteredOnTags;
};

const filterDevfilesOnTypes = (
  devfiles: Devfile[],
  typesStateWithFreq: FilterElem[]
): Devfile[] => {
  const devfilesFilteredOnTypes: Devfile[] = devfiles.filter((devfile: Devfile) =>
    typesStateWithFreq.some((typeStateWithFreq) => devfile.type === typeStateWithFreq.value)
  );
  return devfilesFilteredOnTypes;
};

const getStateAndStringFreq = (arr: string[]): FilterElem[] => {
  const filterElemArr: FilterElem[] = [];
  let prev = '';

  arr.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'accent' }));
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i] ?? null;
    if (arr[i]) {
      if (arr[i] !== prev) {
        filterElemArr.push({ value: arr[i], state: false, freq: 1 });
      } else {
        filterElemArr[filterElemArr.length - 1].freq++;
      }
      prev = arr[i];
    }
  }

  return filterElemArr;
};

const getTagsStateWithFreq = (devfiles: Devfile[]): FilterElem[] => {
  const tagValues: string[] = devfiles?.map((devfile) => devfile?.tags).flat();

  const tagsStateWithFreq: FilterElem[] = getStateAndStringFreq(tagValues);

  return tagsStateWithFreq;
};

const getTypesStateWithFreq = (devfiles: Devfile[]): FilterElem[] => {
  const typeValues: string[] = devfiles?.map((devfile) => devfile.type);

  const tagsStateWithFreq: FilterElem[] = getStateAndStringFreq(typeValues);

  return tagsStateWithFreq;
};

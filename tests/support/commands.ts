/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />

import type { Devfile, FilterElem } from 'custom-types';

import { getDevfileURLs } from './util';

declare global {
  namespace Cypress {
    interface Chainable {
      getDevfiles: typeof getDevfiles;
      compareCardLength: typeof compareCardLength;
      iterateThroughFilter: typeof iterateThroughFilter;
    }
  }
}

type FilterElemsCallback = (selectedFilterElems: FilterElem[]) => void;
type DevfileCallback = (devfiles: Devfile[]) => void;

export const getDevfiles = (callback: DevfileCallback): void => {
  const url = getDevfileURLs();
  cy.request(url).then((response) => {
    const devfiles: Devfile[] = JSON.parse(response.body) as Devfile[];

    callback(devfiles);
  });
};

export const compareCardLength = (length: number): void => {
  cy.get('[data-test-id^=card-]').should('have.length', length);
};

export const iterateThroughFilter = (
  filterType: string,
  filterElemsStateWithFreq: FilterElem[],
  callback: FilterElemsCallback
): void => {
  cy.get(`[data-test-id^=${filterType}-]`).should('have.length', filterElemsStateWithFreq.length);

  for (
    let numFilterElemsSelected = 1;
    numFilterElemsSelected <= filterElemsStateWithFreq.length;
    numFilterElemsSelected++
  ) {
    for (let i = 0; i + numFilterElemsSelected <= filterElemsStateWithFreq.length; i++) {
      const selectedFilterElems: FilterElem[] = filterElemsStateWithFreq.slice(
        i,
        i + numFilterElemsSelected
      );

      if (numFilterElemsSelected === 1 || i !== 0) {
        cy.get(
          `[data-test-id=${filterType}-${selectedFilterElems[
            numFilterElemsSelected - 1
          ].value.replace(/\.| /g, '')}]`
        ).click();
      } else {
        selectedFilterElems.forEach((filterElem) => {
          cy.get(`[data-test-id=${filterType}-${filterElem.value.replace(/\.| /g, '')}]`).click();
        });
      }

      callback(selectedFilterElems);

      if (
        numFilterElemsSelected === 1 ||
        i + numFilterElemsSelected !== filterElemsStateWithFreq.length
      ) {
        cy.get(
          `[data-test-id=${filterType}-${selectedFilterElems[0].value.replace(/\.| /g, '')}]`
        ).click();
      } else {
        selectedFilterElems.forEach((filterElem) => {
          cy.get(`[data-test-id=${filterType}-${filterElem.value.replace(/\.| /g, '')}]`).click();
        });
      }
    }
  }
};

Cypress.Commands.add('getDevfiles', getDevfiles);
Cypress.Commands.add('compareCardLength', compareCardLength);
Cypress.Commands.add('iterateThroughFilter', iterateThroughFilter);

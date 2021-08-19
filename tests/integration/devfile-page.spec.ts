// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
/**
 * page type: stack, sample
 */
describe('Test loaded components', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
  });
  it('Stack page', () => {
    cy.visit('http://localhost:3000/devfiles/Community+java-maven');
    cy.get('[data-testid=dev-page-header]').should('be.visible');
    cy.get('[data-testid=header-tags]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid=dev-page-projects]').should('be.visible');
    cy.get('[data-testid=dev-page-yaml]').should('be.visible');
  });

  it('Sample page', () => {
    cy.visit('http://localhost:3000/devfiles/Community+nodejs-basic');
    cy.get('[data-testid=dev-page-header]').should('be.visible');
    cy.get('[data-testid=header-tags]', { timeout: 5000 }).should('be.visible');
    cy.get('[data-testid=dev-page-projects]').should('not.exist');
    cy.get('[data-testid=dev-page-yaml]').should('be.visible');
    cy.get('[data-testid=git-remotes]', { timeout: 5000 }).should('be.visible');
  });
});

/**
 * link type: zip, git
 * project: with subdirectory, without subdirectory
 */

describe('Test download of', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
  });
  it('Zip project', () => {
    verifyDownloadOnClick('http://localhost:3000/devfiles/Community+java-quarkus');
  });
  it('Git project', () => {
    verifyDownloadOnClick('http://localhost:3000/devfiles/Community+java-maven');
  });
  it('Git project with subdirectory', () => {
    verifyDownloadOnClick('http://localhost:3000/devfiles/Community+java-wildfly');
  });
});

describe('Test select', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
  });
  it('Java Quarkus', () => {
    cy.visit('http://localhost:3000/devfiles/Community+java-quarkus');
    openProjectsExpandable();

    cy.get('[data-testid=dev-page-projects]')
      .get('[data-testid*=projects-selector-item]', { timeout: 10000 })
      .last()
      .click();
    cy.get('[data-testid=dev-page-projects]')
      .get('[data-testid*=projects-selector-item]', { timeout: 10000 })
      .get('[class*=selected]')
      .contains('redhat-product');
  });
});

/**
 * Opens the projects expandable for the current devfile page
 */
function openProjectsExpandable(): void {
  cy.get('[data-testid=dev-page-projects]').get('button').click();
}

/**
 * Opens url webpage, download the first project, and verify successful download of project
 * @param url- Devfile page url to test download on
 */
function verifyDownloadOnClick(url: string): void {
  cy.visit(url);
  openProjectsExpandable();
  cy.get('[data-testid=dev-page-projects]').get('button').last().click();
}

export {};

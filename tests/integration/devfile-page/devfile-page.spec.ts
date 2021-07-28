// / <reference types="cypress" />

/**
 * page type: stack, sample
 */
describe('Test loaded components', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
  });
  it('Stack page', () => {
    cy.visit('http://localhost:3000/devfiles/java-maven');
    cy.get("[id='dev-page-header']").should('be.visible');
    cy.get("[id='header-tags']", { timeout: 10000 }).should('be.visible');
    cy.get("[id='dev-page-projects']").should('be.visible');
    cy.get("[id='dev-page-yaml']").should('be.visible');
  });

  it('Sample page', () => {
    cy.visit('http://localhost:3000/devfiles/nodejs-basic');
    cy.get("[id='dev-page-header']").should('be.visible');
    cy.get("[id='header-tags']", { timeout: 5000 }).should('be.visible');
    cy.get("[id='dev-page-projects']").should('not.exist');
    cy.get("[id='dev-page-yaml']").should('not.exist');
    cy.get("[id='git-remotes']", { timeout: 5000 }).should('be.visible');
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
    verifyDownloadOnClick('http://localhost:3000/devfiles/java-quarkus');
  });
  it('Git project', () => {
    verifyDownloadOnClick('http://localhost:3000/devfiles/java-maven');
  });
  it('Git project with subdirectory', () => {
    verifyDownloadOnClick('http://localhost:3000/devfiles/java-wildfly');
  });
});

describe('Test select', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
  });
  it('Maven Java', () => {
    cy.visit('http://localhost:3000/devfiles/java-maven');
    cy.get("[id='dev-page-projects']")
      .get("[id='project-list-item']", { timeout: 10000 })
      .last()
      .click({ force: true });
    cy.get("[id='dev-page-projects']")
      .get("[id='project-list-item']", { timeout: 10000 })
      .get('[class*=selected]')
      .contains('redhat-product');
  });
});

/**
 * Opens url webpage, download the first project, and verify successful download of project
 * @param url Devfile page url to test download on
 */
function verifyDownloadOnClick(url: string) {
  cy.visit(url);
  cy.get("[id='dev-page-projects']").get('button').click({ force: true });
  cy.get("[id='dev-page-projects']")
    .get('button')
    .last()
    .click({ force: true });
}

export {};

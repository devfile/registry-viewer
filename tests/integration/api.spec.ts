/* eslint-disable no-unused-expressions */
// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
import JSZip from 'jszip';

/**
 * repo link: git, zip
 *      git: commit id, branch, tag
 * subdirectory: undefined, existing, non-existing
 */
describe('Test valid fetch', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:3000');
  });

  it('zip file', () => {
    const expected = ['test', 'main'];
    const url =
      'https://code.quarkus.io/d?e=io.quarkus%3Aquarkus-resteasy&e=io.quarkus%3Aquarkus-micrometer&e=io.quarkus%3Aquarkus-smallrye-health&e=io.quarkus%3Aquarkus-openshift&cn=devfile';
    checkForValidZipFetch(url, 'src', expected);
  });

  it('git file', () => {
    const expected = ['src', 'README.adoc', 'pom.xml'];
    checkForValidZipFetch(
      'https://api.github.com/repos/wildfly/quickstart/zipball/',
      'microprofile-health',
      expected
    );
  });

  it('git repo with tag', () => {
    const expected = ['src', 'README.adoc', 'pom.xml'];
    checkForValidZipFetch(
      'https://api.github.com/repos/wildfly/quickstart/zipball/23.0.2.Final',
      'microprofile-health',
      expected
    );
  });

  it('git repo with commit ID', () => {
    const expected = ['src', 'README.adoc', 'pom.xml'];
    checkForValidZipFetch(
      'https://api.github.com/repos/wildfly/quickstart/zipball/66661cf477f74f60c12de40b9d84ce13576e6f44',
      'microprofile-opentracing',
      expected
    );
  });
});

describe('Test invalid fetch', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:3000');
  });

  it('zip file with non-existing subdirectory', () => {
    const data = {
      url: 'https://code.quarkus.io/d?e=io.quarkus%3Aquarkus-resteasy&e=io.quarkus%3Aquarkus-micrometer&e=io.quarkus%3Aquarkus-smallrye-health&e=io.quarkus%3Aquarkus-openshift&cn=devfile',
      subdirectory: 'non-existing'
    };
    cy.request({
      url: '/api/download-subdirectory',
      failOnStatusCode: false,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).should(async (response) => {
      expect(response.status).to.eq(404);
    });
  });

  it('zip file with non-existing link', () => {
    const data = {
      url: 'https://non-existing.com/',
      subdirectory: 'non-existing'
    };
    cy.request({
      url: '/api/download-subdirectory',
      failOnStatusCode: false,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).should(async (response) => {
      expect(response.status).to.eq(500);
    });
  });
});

/**
 * Compares two arrays for equality
 * @param a - array to compare
 * @param b - array to compare
 * @returns boolean of whether arrays a and b are equal
 */
function areArraysEqual<T>(a: T, b: T): boolean {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

/**
 * Checks that fetch for extracting the subdirectory returns the right zip by
 *  * checking status of response (should be 200)
 *  * checking files and folders at first level of zip (should equal @param expectedRootFileAndFolders-)
 * @param url - url to fetch zip from
 * @param subdirectory - subdirectory to extract from zip
 * @param expectedRootFileAndFolders - expected files and folders at first level of zip
 */
function checkForValidZipFetch(
  url: string,
  subdirectory: string,
  expectedRootFileAndFolders: string[]
): void {
  const data = {
    url,
    subdirectory
  };
  const expected = expectedRootFileAndFolders;
  expected.sort((a, b) => a.localeCompare(b));

  cy.request({
    url: '/api/download-subdirectory',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).should(async (response) => {
    expect(response.status).to.eq(200);

    const array = await response.body;
    const zip = await JSZip.loadAsync(array, { base64: true });

    const zipFiles = new Array<string>();
    Object.keys(zip.files).forEach((fileName) => {
      const firstLevelDirectory = fileName.split('/')[0];
      if (!zipFiles.includes(firstLevelDirectory)) {
        zipFiles.push(firstLevelDirectory);
      }
    });
    zipFiles.sort((a, b) => a.localeCompare(b));

    expect(areArraysEqual(zipFiles, expected)).to.be.true;
  });
}

export {};

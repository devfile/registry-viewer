/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />

export {};

module.exports = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Cypress.PluginConfigOptions => {
  require('@cypress/code-coverage/task')(on, config);
  return config;
};

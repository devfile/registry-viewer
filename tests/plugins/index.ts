// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />

export {};

module.exports = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  require('@cypress/code-coverage/task')(on, config);
  return config;
};

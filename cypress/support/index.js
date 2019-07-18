import './commands';
// import './auto-stub-api';
import './stub-api';

// @see https://github.com/cypress-io/cypress/issues/95
Cypress.on('window:before:load', win => {
  win.fetch = null;
});

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

import './auto-stub-api';
import './commands';

// returning false here prevents Cypress from
// failing the test
Cypress.on('uncaught:exception', () => false);

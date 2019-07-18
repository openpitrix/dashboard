describe('Login page', () => {
  let { username, password } = Cypress.env('user') || {};

  // compat with ci mode
  if (!username || !password) {
    username = Cypress.env('user_username');
    password = Cypress.env('user_password');
  }

  before(() => {
    // disable stub api
    cy._disableStub = true;
  });

  beforeEach(() => {
    cy.route('POST', '/api/oauth2/token').as('authToken');
  });

  it('Normal user login', () => {
    cy.visit('/login');

    cy.get('input[name="email"]')
      .type(username)
      .should('have.value', username);

    cy.get('input[name="password"]')
      .type(password)
      .should('have.value', password);

    cy.get('button[type="submit"]').click();

    // this alias if already set in stub-api
    cy.wait('@authToken');

    // cy.url().should('not.include', '/login');
    cy.getCookie('access_token').should('exist');
  });
});

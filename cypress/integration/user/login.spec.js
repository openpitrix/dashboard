describe('Dashboard Page login', () => {
  const username = 'admin@op.com';
  const password = 'passw0rd';
  it('Login admin account', () => {
    cy.visit('login');
    cy.get('input[name="email"]')
      .type(username)
      .should('have.value', username);
    cy.get('input[name="password"]')
      .type(password)
      .should('have.value', password);
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('not.eq', 'login');
  });
});

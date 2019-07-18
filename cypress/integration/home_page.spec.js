describe(`Home page`, () => {
  // todo: if you want stub manually
  // before(()=> {
  //   cy._autoStub=false;
  // })
  //
  // beforeEach(()=> {
  //   cy.loadFixtureByTest(records=> {
  //     records.forEach(({method, url, _sid, response})=> {
  //       cy.route(method, `${url}?_sid=${_sid}`, response).as(_sid)
  //     })
  //   })
  // })

  it(`Search app`, () => {
    cy.visit('/');

    cy.get('.banner [data-cy="search-box"]')
      .should('be.visible')
      .type('wordpress{enter}');

    cy.get('.main .section-size-9').should('have.length', 1);
  });
});

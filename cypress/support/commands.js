const login = (data, type = 'admin') => {
  cy.request({
    url: '/api/oauth2/token', // assuming you've exposed a seeds route
    method: 'post',
    body: Object.assign(
      {
        method: 'post',
        grant_type: 'password',
        scope: ''
      },
      data
    )
  }).then(() => {
    cy.getCookie('access_token').should('exist');
    cy.setCookie('lang', 'en');

    if (type === 'admin') {
      cy.setCookie('portal', 'global_admin');
      cy.setCookie('role', 'global_admin');
    } else if (type === 'isv') {
      cy.setCookie('portal', 'isv');
      cy.setCookie('role', 'isv');
    } else {
      cy.setCookie('portal', 'user');
      cy.setCookie('role', 'user');
    }
  });
};

Cypress.Commands.add('login', (userType = 'admin') => {
  const data = Cypress.env(userType);
  login(data, userType);
});

function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

Cypress.Commands.add(
  'upload',
  {
    prevSubject: 'element'
  },
  (subject, file, fileName) => {
    // we need access window to create a file below
    cy.window().then(window => {
      const blob = b64toBlob(file, '', 512);
      const testFile = new window.File([blob], fileName);
      cy.wrap(subject).trigger('drop', {
        dataTransfer: { files: [testFile] }
      });
    });
  }
);

Cypress.Commands.add('waitAMoment', () => {
  cy.wait(Cypress.env('WAIT_A_MOMENT'));
});

Cypress.Commands.add('waitASecond', () => {
  cy.wait(Cypress.env('WAIT_A_Second'));
});

Cypress.Commands.add('waitLoading', () => {
  cy.get('[data-cy="loading"]').should('exist');
  cy.get('[data-cy="loading"]').should('not.exist');
});

Cypress.Commands.add('loadingExit', () => {
  cy.get('[data-cy="loading"]').should('not.exist');
});

Cypress.Commands.add('waitUntilAllAPIFinished', () => {
  const timeout = Cypress.env('apiMaxWaitingTime') || 60 * 1000;
  cy.log('Waiting for pending API requests:');
  cy.get('body', { timeout, log: false }).should(() => {
    expect(cy._apiCount).to.eq(0);
  });
});

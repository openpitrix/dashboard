import { base64toBlob } from '../utils';

const login = (role = 'user', data = {}) => {
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
  }).then(res => {
    cy.getCookie('access_token').should('exist');
    cy.setCookie('lang', 'en');

    if (role === 'admin') {
      cy.setCookie('portal', 'global_admin');
      cy.setCookie('role', 'global_admin');
    } else if (role === 'isv') {
      cy.setCookie('portal', 'isv');
      cy.setCookie('role', 'isv');
    } else {
      cy.setCookie('portal', 'user');
      cy.setCookie('role', 'user');
    }
  });
};

Cypress.Commands.add('login', (role = 'user') => {
  const roleConf = Cypress.env(role);
  if (!roleConf) {
    // fallback, can compact with ci mode
    Object.assign(roleConf, {
      username: Cypress.env(`${role}_username`),
      password: Cypress.env(`${role}_password`)
    });
  }
  login(role, roleConf);
});

Cypress.Commands.add(
  'upload',
  {
    prevSubject: 'element'
  },
  (subject, file, fileName) => {
    // we need access window to create a file below
    cy.window().then(window => {
      const blob = base64toBlob(file, '', 512);
      const testFile = new window.File([blob], fileName);
      cy.wrap(subject).trigger('drop', {
        dataTransfer: { files: [testFile] }
      });
    });
  }
);

// load fixture for certain test case
// default is current test
Cypress.Commands.add(
  'loadFixtureByTest',
  (testCase = cy._testCaseTitle, handleRecords = x => x) => {
    const fixture = Cypress.spec.name.replace('.spec.js', '');

    // dont rely on arguments
    if (typeof testCase === 'function') {
      handleRecords = testCase;
      testCase = cy._testCaseTitle;
    }

    if (cy._cachedFixtures[testCase]) {
      // load from cache
      handleRecords(cy._cachedFixtures[testCase]);
      return;
    }

    cy.task('existsFixture', fixture).then(exist => {
      if (exist) {
        cy.fixture(fixture).then(data => {
          if (data[testCase]) {
            handleRecords(
              (cy._cachedFixtures[testCase] = data[testCase].records)
            );
          }
        });
      }
    });
  }
);

Cypress.Commands.add('mockRecords', (records = []) => {
  records.forEach(({ method, url, _sid, response }) => {
    // automatically stub request without alias
    // if you need alias, do it manually
    cy.route(method, `${url}?_sid=${_sid}`, response);
  });
});

import { uniqueID } from '../../utils';

describe('Create app', () => {
  const fileName = 'mock-app.tgz';
  let appId = '';
  let appVersionId = '';

  const setAppId = path => {
    const reg = /.*\/apps\/(.*)\/versions\/(.*)/;
    const groups = reg.exec(path);
    appId = groups[1];
    appVersionId = groups[2];
  };

  beforeEach(() => {
    // globstar will match url suffix with sid
    cy.route('POST', '/api/apps/validate_package**').as('validatePackage');
  });

  it.only('Create VM app', () => {
    cy.login('isv');
    cy.visit('/dev/apps');

    // step 1
    cy.get('[data-cy="createApp"]').click();
    cy.get('[data-cy="VM"]').click();
    cy.get('[data-cy="nextStep"]')
      .should('have.attr', 'data-disable', 'false')
      .click();

    // step 2
    cy.fixture(fileName, 'base64').then(content => {
      cy.get('[data-cy="uploadFile"]').upload(content, fileName);
    });
    cy.wait('@validatePackage');

    cy.get('[data-cy="nextStep"]')
      .should('have.attr', 'data-disable', 'false')
      .click();

    // step 3
    cy.get('[data-cy="nextStep"]')
      .should('have.attr', 'data-disable', 'false')
      .click();

    cy.get('[data-cy="appDetailLink"]')
      .should('be.visible')
      .click();

    cy.get('[data-cy="appVersionDetailLink"]')
      .should('be.visible')
      .click();

    cy.location('pathname').then(setAppId);
    cy.log(appVersionId, appId);
  });

  it('Submit version', () => {
    cy.login('isv');

    cy.visit('/dev/apps');

    cy.get('[data-cy="appDetailLink"]')
      .first()
      .click();

    cy.get('[data-cy="appVersionDetailLink"]')
      .first()
      .click();

    cy.get('[data-cy="releaseAppBtn"]').click();
    cy.get('button[type="submit"]').click();

    cy.get('input[name="name"]').type(uniqueID());
    cy.get('input[name="abstraction"]').type('TEST ABSTRACTION');
    cy.get('textarea[name="description"]').type('TEST DESCRIPTION');
    cy.get('[data-cy="nextStep"]')
      .should('have.attr', 'data-disable', 'false')
      .click();

    cy.get('[data-cy="nextStep"]')
      .should('have.attr', 'data-disable', 'false')
      .click();

    cy.get('[data-cy="nextStep"]')
      .should('have.attr', 'data-disable', 'false')
      .click();
  });

  // it('Admin reject app version', () => {
  //   cy.waitASecond();
  //   cy.login('admin');
  //   cy.visit(`/admin/apps/review/`);
  //   cy.loadingExit();
  //
  //   cy.get(`[data-version_id="${appVersionId}"]`).click();
  //   cy.loadingExit();
  //
  //   cy.get('[data-cy="rejectBtn"]').click({ force: true });
  //   cy.get('form textarea').type('TRY AGAIN');
  //   cy.get('button[type="submit"]').click();
  // });

  it('Submit version again', () => {
    cy.login('isv');

    cy.visit('/dev/apps');

    // cy.waitLoading();

    cy.get('[data-cy="appDetailLink"]')
      .first()
      .click();

    cy.get('[data-cy="appVersionDetailLink"]')
      .first()
      .click();
    // cy.waitLoading();

    cy.get('[data-cy="releaseAppBtn"]').click();
    cy.get('button[type="submit"]').click();
    // cy.waitAMoment();
    cy.get('[data-cy="nextStep"]')
      .should('have.attr', 'data-disable', 'false')
      .click();

    cy.get('[data-cy="nextStep"]')
      .should('have.attr', 'data-disable', 'false')
      .click();
    // cy.waitAMoment();

    cy.get('[data-cy="nextStep"]')
      .should('have.attr', 'data-disable', 'false')
      .click();
  });

  // it('Admin pass app version', () => {
  //   // cy.waitASecond();
  //   cy.login('admin');
  //
  //   cy.visit(`/admin/apps/review/`);
  //   cy.get(`[data-version_id="${appVersionId}"]`)
  //     .should('be.visible')
  //     .click();
  //   cy.get('[data-cy="passBtn"]')
  //     .should('be.visible')
  //     .click();
  //   cy.get('button[type="submit"]').click();
  // });

  it('Release app to store', () => {
    cy.login('isv');
    cy.visit(`/dev/apps/${appId}/versions/${appVersionId}`);
    cy.get('[data-cy="releaseAppBtn"]').click();
  });

  // it('Suspend app', () => {
  //   cy.login('admin');
  //   cy.visit(`/admin/apps/${appId}`);
  //   cy.wait(['@fetchCluster', '@fetchCluster'])
  //     .then(() => {
  //       cy.get('[data-cy="appBaseInfo"] [data-cy="popoverBtn"]').click();
  //     })
  //     .then(() => {
  //       cy.get('[data-cy="suspendAppBtn"]').click();
  //       cy.get('button[type="submit"]').click();
  //     });
  // });

  it('Delete app', () => {
    cy.login('isv');

    cy.visit(`/dev/apps/`);

    cy.get('[data-cy="appDetailLink"]')
      .first()
      .click();

    // cy.get('[data-cy="appVersionDetailLink"]').click();
    cy.contains('Expand').click();
    cy.contains('View detail').click({ force: true });

    cy.get('[data-cy="appVersionInfo"] [data-cy="popoverBtn"]').click();
    cy.get('[data-cy="deleteAppVersionBtn"]').click();
    cy.get('button[type="submit"]').click();

    cy.visit(`/dev/apps`);

    cy.get(`[data-cy="appDetailLink"] [data-cy="popoverBtn"]`)
      .first()
      .click()
      .then(() => {
        cy.get('[data-cy="deleteAppBtn"]')
          .first()
          .click();
      });

    cy.get('button[type="submit"]').click();
  });
});

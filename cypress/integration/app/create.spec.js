import day from 'dayjs';

const uniqueID = () =>
  `${day(new Date()).format('MM-DD')}_${Math.random()
    .toString(36)
    .substr(2)}`;

describe('Deploy app', () => {
  const fileName = 'files/nginx-vm.tar.gz';
  let appId = '';
  let appVersionId = '';

  beforeEach(() => {
    cy.route('POST', 'api/apps/validate_package').as('checkPackage');
    cy.route('POST', 'api/clusters').as('fetchCluster');
    cy.route('POST', 'api/debug_clusters').as('fetchDebugCluster');
    cy.route({
      url: 'api/apps',
      method: 'POST',
      data: {
        method: '"patch"'
      }
    }).as('modifyApp');
    cy.route('POST', 'api/apps').as('fetchApp');
    cy.route('POST', 'api/app_versions').as('fetchVersion');
    cy.route('POST', 'api/active_apps').as('fetchActiveApp');
    cy.route('POST', '/api/app_version_reviews').as('fetchAppReview');
    cy.route('POST', 'api/app_version/action/review/business').as(
      'reviewBusines'
    );
    cy.route('POST', 'api/app_version/action/pass/business').as('passBusines');
    cy.route({
      url: 'api/app_version/action/submit',
      method: 'POST',
      delay: 50
    }).as('submitVersion');
    cy.route('POST', 'api/users').as('fetchUser');
  });

  const setAppId = path => {
    const reg = /.*\/apps\/(.*)\/versions\/(.*)/;
    const groups = reg.exec(path);
    appId = groups[1];
    appVersionId = groups[2];
  };

  it('Create VM app', () => {
    cy.login('isv');
    cy.visit('/dev/apps', {
      onBeforeLoad: win => {
        win.fetch = null;
      }
    });
    cy.waitLoading();

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
    cy.wait('@checkPackage');
    cy.get('[data-cy="nextStep"]')
      .should('have.attr', 'data-disable', 'false')
      .click();

    // step 3
    cy.get('[data-cy="nextStep"]')
      .should('have.attr', 'data-disable', 'false')
      .click();
    cy.loadingExit();

    cy.get('[data-cy="appDetailLink"]')
      .should('be.visible')
      .click();
    cy.loadingExit();
    cy.get('[data-cy="appVersionDetailLink"]')
      .should('be.visible')
      .click();
    cy.loadingExit();
    cy.location('pathname').then(setAppId);
    cy.log(appVersionId, appId);
  });

  it('Submit version', () => {
    cy.login('isv');

    cy.visit('/dev/apps');
    cy.waitLoading();
    cy.get('[data-cy="appDetailLink"]')
      .first()
      .click();
    // cy.waitLoading();

    cy.get('[data-cy="appVersionDetailLink"]')
      .first()
      .click();
    cy.waitLoading();

    cy.get('[data-cy="releaseAppBtn"]').click();
    cy.get('button[type="submit"]').click();

    cy.get('input[name="name"]').type(uniqueID());
    cy.get('input[name="abstraction"]').type('TEST ABSTRACTION');
    cy.get('textarea[name="description"]').type('TEST DESCRIPTION');
    cy.get('[data-cy="nextStep"]')
      .should('have.attr', 'data-disable', 'false')
      .click();
    // cy.waitLoading();

    cy.get('[data-cy="nextStep"]')
      .should('have.attr', 'data-disable', 'false')
      .click();
    cy.loadingExit();
    cy.waitAMoment();

    cy.get('[data-cy="nextStep"]')
      .should('have.attr', 'data-disable', 'false')
      .click();
    cy.loadingExit();
  });

  it('Admin reject app verison', () => {
    cy.waitASecond();
    cy.login('admin');
    cy.visit(`/admin/apps/review/`);
    cy.loadingExit();

    cy.get(`[data-version_id="${appVersionId}"]`).click();
    cy.loadingExit();

    cy.get('[data-cy="rejectBtn"]').click({ force: true });
    cy.get('form textarea').type('TRY AGAIN');
    cy.get('button[type="submit"]').click();
  });

  it('Submit version again', () => {
    cy.login('isv');

    cy.visit('/dev/apps');
    cy.waitLoading();
    cy.get('[data-cy="appDetailLink"]')
      .first()
      .click();

    cy.get('[data-cy="appVersionDetailLink"]')
      .first()
      .click();
    cy.waitLoading();

    cy.get('[data-cy="releaseAppBtn"]').click();
    cy.get('button[type="submit"]').click();
    cy.waitAMoment();
    cy.get('[data-cy="nextStep"]')
      .should('have.attr', 'data-disable', 'false')
      .click();

    cy.get('[data-cy="nextStep"]')
      .should('have.attr', 'data-disable', 'false')
      .click();
    cy.waitAMoment();

    cy.get('[data-cy="nextStep"]')
      .should('have.attr', 'data-disable', 'false')
      .click();
  });

  it('Admin pass app verison', () => {
    cy.waitASecond();
    cy.login('admin');

    cy.visit(`/admin/apps/review/`);
    cy.get(`[data-version_id="${appVersionId}"]`)
      .should('be.visible')
      .click();
    cy.get('[data-cy="passBtn"]')
      .should('be.visible')
      .click();
    cy.get('button[type="submit"]').click();
  });

  it('Release app to store', () => {
    cy.login('isv');
    cy.visit(`/dev/apps/${appId}/versions/${appVersionId}`);
    cy.get('[data-cy="releaseAppBtn"]').click();
  });

  it('Suspend app', () => {
    cy.login('admin');
    cy.visit(`/admin/apps/${appId}`);
    cy.wait(['@fetchCluster', '@fetchCluster'])
      .then(() => {
        cy.get('[data-cy="appBaseInfo"] [data-cy="popoverBtn"]').click();
      })
      .then(() => {
        cy.get('[data-cy="suspendAppBtn"]').click();
        cy.get('button[type="submit"]').click();
      });
  });

  it('Delete app', () => {
    cy.login('isv');

    cy.visit(`/dev/apps/`);
    cy.waitLoading();
    cy.get('[data-cy="appDetailLink"]')
      .first()
      .click();
    cy.loadingExit();
    // cy.get('[data-cy="appVersionDetailLink"]').click();
    cy.contains('Expand').click();
    cy.contains('View detail').click({ force: true });
    cy.loadingExit();
    cy.get('[data-cy="appVersionInfo"] [data-cy="popoverBtn"]').click();
    cy.get('[data-cy="deleteAppVersionBtn"]').click();
    cy.get('button[type="submit"]').click();

    cy.visit(`/dev/apps`);
    cy.loadingExit();

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

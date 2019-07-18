const { getUrlPath, getHashByParams } = require('../../lib/mock');

// dynamic stub api request
const recordApi = Boolean(Cypress.env('recordApi'));
const shouldRecord = () => recordApi && cy._disableStub !== true;

before(function() {
  // gather xhr mock data for each spec
  cy._mockData = {};
  cy._snapshotName = Cypress.spec.name.replace('.spec.js', '');

  // cache fixtures
  cy._cachedFixtures = {};
});

beforeEach(function() {
  const testCaseTitle = (cy._testCaseTitle = this.currentTest.fullTitle());

  cy.server({
    // all request send to node proxy server by post method
    method: 'POST',
    onResponse: xhr => {
      const { url, method, request, response } = xhr;

      if (shouldRecord()) {
        // record mode
        if (!cy._mockData[testCaseTitle]) {
          cy._mockData[testCaseTitle] = {
            records: []
          };
        }

        const curMock = cy._mockData[testCaseTitle];

        const record = {
          url: getUrlPath(url),
          method,
          // stub id, will append to url
          _sid: getHashByParams(request.body)
        };

        if (!Cypress._.find(curMock.records, record)) {
          curMock.records.push(
            Object.assign(record, {
              data: request.body,
              response: response.body
            })
          );

          // update timestamp
          curMock.timestamp = new Date().toISOString();
        }
      }
    }
  });

  if (recordApi) {
    // stub all api
    cy.route('POST', '/api/**');
  } else {
    // if some spec defined not stub api
    // we should not start mock server and use real request
    if (cy._disableStub === true) {
      return;
    }

    // when not in record mode, auto stub request
    if (cy._autoStub !== false) {
      cy.loadFixtureByTest(records => {
        cy.mockRecords(records);
      });
    }
  }
});

after(function() {
  if (shouldRecord()) {
    cy.writeFile(`cypress/fixtures/${cy._snapshotName}.json`, cy._mockData, {
      log: false
    });
  }
});

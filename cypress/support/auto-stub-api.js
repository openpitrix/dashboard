import _ from 'lodash';

function getFixtureName(spec) {
  const specName = spec.name
    .replace('integration/', '')
    .replace('.spec.js', '');
  return `api/${specName}.snapshot.json`;
}

// do not use arrow function because we need to use `this` inside
beforeEach(function () {
  const forceAPIRecording = Cypress.env('forceAPIRecording');
  /**
   * Recording mode is on when:
   *   `forceAPIRecording` flag is True, or
   *   Fixture for this test case is not existed (same as Jest snapshot test)
   *
   * `forceAPIRecording` is a flag you can use to update fixture
   */

  // a promise which will resolve value for isInRecordingMode
  let isInRecordingModePromise;
  // test case information
  const testFileInfo = Cypress.spec;
  const fixtureName = getFixtureName(testFileInfo);
  const fixturePath = `cypress/fixtures/${fixtureName}`;
  const testCaseTitle = this.currentTest.fullTitle();
  cy.testCaseTitle = testCaseTitle;
  // cy.window().then(win => cy.stub(win, '__getSpec', function () {
  //   return testFileInfo;
  // }));

  if (forceAPIRecording) {
    isInRecordingModePromise = Cypress.Promise.resolve(true);
  } else {
    isInRecordingModePromise = cy
      .task('isFixtureExisted', fixturePath, { log: false })
      .then(isFixtureExisted => {
        if (!isFixtureExisted) {
          // turn on recording if fixture file is not existed
          return true;
        }

        // check if there is a key whose name is the same as this test case
        return cy.readFile(fixturePath, { log: false }).then(
          // turn on recording if fixture for this test case is not existed
          apiRecords => !apiRecords[testCaseTitle]
        );
      });
  }

  isInRecordingModePromise.then(isInRecordingMode => {
    cy._isInRecordingMode = isInRecordingMode;

    cy.log(`API Auto Recording: ${isInRecordingMode ? 'ON' : 'OFF'}`);
    if (isInRecordingMode) {
      cy.log('Use real API response.');
    } else {
      cy.log(`Use recorded API response: ${fixtureName}`);
    }

    cy._apiData = [];
    cy._apiCount = 0;
    cy.server({
      onRequest: () => {
        cy._apiCount++;
      },
      onResponse: xhr => {
        /**
         * Sometimes there are some time windows between API requests, e.g. Request1 finishes,
         * but Request2 starts after 100ms, in this case, cy.waitUntilAllAPIFinished() would
         * not work correctly, so when we decrease the counter, we need to have a delay here.
         */
        const delayTime = isInRecordingMode ? 500 : 0;
        if (cy._apiCount === 1) {
          setTimeout(() => {
            cy._apiCount--;
          }, delayTime);
        } else {
          cy._apiCount--;
        }

        if (isInRecordingMode) {
          /**
           * save URL without the host info, because API host might be different between
           * Record and Replay session
           */
          let url = '';
          let matchHostIndex = -1;
          const apiHosts = Cypress.env('apiHosts').split(',');
          for (let i = 0; i < apiHosts.length; i++) {
            const host = apiHosts[i].trim();
            if (xhr.url.includes(host)) {
              url = xhr.url.replace(host, '');
              matchHostIndex = i;
              break;
            }
          }

          const method = xhr.method;
          const request = {
            body: _.omit(xhr.request.body, ['_specName', '_testTitle'])
          };
          const response = {
            body: xhr.response.body
          };
          // save API request/response into an array so we can write these info to fixture
          cy._apiData.push({
            url,
            method,
            request,
            response,
            matchHostIndex
          });
        }
      }
    });
  });
});

// do not use arrow function because we need to use `this` inside
afterEach(function () {
  // only save api data to fixture when test is passed
  if (this.currentTest.state === 'passed' && cy._isInRecordingMode) {
    const testFileInfo = Cypress.spec;
    const fixtureName = getFixtureName(testFileInfo);
    const fixturePath = `cypress/fixtures/${fixtureName}`;
    const testCaseTitle = this.currentTest.fullTitle();
    // if fixture file exists, only update the data related to this test case
    cy.task('isFixtureExisted', fixturePath, { log: false }).then(
      isFixtureExisted => {
        if (isFixtureExisted) {
          cy.readFile(fixturePath, { log: false }).then(apiRecords => {
            apiRecords[testCaseTitle] = {
              timestamp: new Date().toJSON(),
              records: cy._apiData
            };
            cy.writeFile(fixturePath, apiRecords, { log: false });
          });
        } else {
          cy.writeFile(
            fixturePath,
            {
              [testCaseTitle]: {
                timestamp: new Date().toJSON(),
                records: cy._apiData
              }
            },
            { log: false }
          );
        }
        cy.log('API recorded', cy._apiData);
      }
    );
  }
});

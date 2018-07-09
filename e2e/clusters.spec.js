import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import setup from './setup';

fixture`dashboard/clusters tests`
  .page(setup.getPageUrl('dashboard/clusters'))
  .beforeEach(async () => {
    await waitForReact();
  });

test(`basic render`, async t => {});

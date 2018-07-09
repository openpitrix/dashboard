import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import setup from './setup';

fixture`dashboard/categories tests`
  .page(setup.getPageUrl('dashboard/categories'))
  .beforeEach(async () => {
    await waitForReact();
  });

test(`basic render`, async t => {});

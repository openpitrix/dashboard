import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import setup from './setup';

fixture`dashboard/runtimes tests`
  .page(setup.getPageUrl('dashboard/runtimes'))
  .beforeEach(async () => {
    await waitForReact();
  });

test(`basic render`, async t => {});

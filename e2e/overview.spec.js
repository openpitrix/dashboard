import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import setup from './setup';

fixture`dashboard/overview tests`
  .page(setup.getPageUrl('dashboard/overview'))
  .beforeEach(async () => {
    await waitForReact();
  });

test(`basic render`, async t => {});

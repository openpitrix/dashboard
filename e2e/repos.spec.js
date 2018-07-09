import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import setup from './setup';

fixture`dashboard/repos tests`.page(setup.getPageUrl('dashboard/repos')).beforeEach(async () => {
  await waitForReact();
});

test(`basic render`, async t => {});

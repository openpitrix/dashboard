import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import setup from './setup';
import { normalRole } from './role';

fixture`dashboard/apps tests`.page(setup.getPageUrl('dashboard/apps')).beforeEach(async () => {
  await waitForReact();
});

test(`basic render`, async t => {
  await t
    .useRole(normalRole)
    .expect(ReactSelector('Table').count)
    .eql(1);
});

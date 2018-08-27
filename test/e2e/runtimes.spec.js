import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import setup from './setup';
import { normalRole } from './role';

const page = setup.getPageUrl('dashboard/runtimes');

fixture`dashboard/runtimes tests`.page(page).beforeEach(async t => {
  await waitForReact();
  await t.useRole(normalRole).navigateTo(page);
});

test(`basic render`, async t => {
  await t.expect(ReactSelector('Table').count).eql(1);
});

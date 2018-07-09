import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import setup from './setup';

fixture`Home tests`.page(setup.getPageUrl()).beforeEach(async () => {
  await waitForReact();
});

test(`basic render`, async t => {
  const app = ReactSelector('App');
  // const appProps = await app.getReact();

  await t.expect(app.count).eql(1);
});

test.only(`search box`, async t => {
  const searchBox = ReactSelector('App Banner Search');
  const appListItems = ReactSelector('App AppList Link');

  await t.expect(searchBox.count).eql(1);
  await t
    .typeText(searchBox, 'zk')
    .pressKey('enter')
    .expect(appListItems.count)
    .gte(0);
});

import { Role } from 'testcafe';
import setup from './setup';

const user = 'normal';
const pass = 'zhu88jie';

const normalRole = Role(setup.getPageUrl('login'), async t => {
  await t
    .typeText('input[name=username]', user)
    .typeText('input[name=password]', pass)
    .click('button[type=submit]');
});

// workaround
// https://testcafe-discuss.devexpress.com/t/running-multiple-tests-on-already-authenticated-session-browser-app/160/7
const fixCookie = () => {
  let role = 'normal',
    now = Date.now(),
    domain = 'localhost'; // fix domain when in docker env

  document.cookie = `user=${user}; path=/; domain=${domain}`;
  document.cookie = `role=${role}; path=/; domain=${domain}`;
  document.cookie = `last_login=${now}; path=/; domain=${domain}`;
};

module.exports = {
  normalRole,
  fixCookie
};

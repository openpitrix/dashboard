import { Role } from 'testcafe';
import setup from './setup';

const normalRole = Role(setup.getPageUrl('login'), async t => {
  await t
    .typeText('input[name=username]', 'normal')
    .typeText('input[name=password]', 'zhu88jie')
    .click('button[type=submit]');
});

module.exports = {
  normalRole
};

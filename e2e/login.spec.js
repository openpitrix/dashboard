import setup from './setup';

fixture`Login test`.page(setup.getPageUrl('login')).beforeEach(async t => {
  await t.eval(function() {
    let user = 'normal',
      role = 'normal',
      now = Date.now(),
      domain = 'localhost';

    document.cookie = `user=${user}; path=/; domain=${domain}`;
    document.cookie = `role=${role}; path=/; domain=${domain}`;
    document.cookie = `last_login=${now}; path=/; domain=${domain}`;
  });

  await t.navigateTo(setup.getPageUrl());
});

test('perform login', async t => {
  await t.wait(2000);
});

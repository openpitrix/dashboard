import 'promise-polyfill/src/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import RootStore from './stores/RootStore';
import SockClient from './utils/sock-client';
import i18n from './i18n';
import UserProvider from 'providers/user';

import { getCookie } from './utils';

const store = new RootStore(window.__INITIAL_STATE__);
store.registerStores();

// fix ssr notifications store not sync
store.notifications = [];

if (typeof window !== 'undefined') {
  const user = new UserProvider();

  let sc = null;
  // when logged in, setup socket client
  if (user.isLoggedIn()) {
    const sockEndpoint = SockClient.composeEndpoint(store.socketUrl, user.accessToken);
    sc = new SockClient(sockEndpoint);
    sc.setUp();
  }

  store.setUser(user);

  // todo:  in dev mode
  window._user = user;
  window._store = store;

  import('./routes').then(({ default: routes }) => {
    ReactDOM.render(
      <App routes={routes} store={store} i18n={i18n} sock={sc} />,
      document.getElementById('root')
    );
  });
}

import 'promise-polyfill/src/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import RootStore from './stores/RootStore';
import SockClient from './utils/sock-client';
import i18n from './i18n';

import { getCookie } from './utils';

const store = new RootStore(window.__INITIAL_STATE__);
store.registerStores();

// fix ssr notifications store not sync
store.notifications = [];

if (typeof window !== 'undefined') {
  try {
    store.user = JSON.parse(getCookie('user') || '{}');
    const role = getCookie('role');
    if (role === 'user') {
      store.user.isDev = false;
      store.user.isNormal = true;
    }
  } catch (err) {}

  let sc = null;
  const accessToken = getCookie('access_token');

  // when logged in, setup socket client
  if (accessToken) {
    const sockEndpoint = SockClient.composeEndpoint(store.socketUrl, accessToken);
    sc = new SockClient(sockEndpoint);
    sc.setUp();
  }

  import('./routes').then(({ default: routes }) => {
    ReactDOM.render(
      <App routes={routes} store={store} i18n={i18n} sock={sc} />,
      document.getElementById('root')
    );
  });
}

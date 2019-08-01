// polyfills
import 'promise-polyfill/src/polyfill';
import '../lib/blob/Blob';
import React from 'react';
import ReactDOM from 'react-dom';

import SockClient, { getEndpoint } from 'providers/sock-client';
import App from './App';
import RootStore from './stores/RootStore';
import i18n from './i18n';
import user from './providers/user';

const store = new RootStore(window.__INITIAL_STATE__);
store.registerStores();

// fix ssr notifications store not sync
store.notifications = [];

if (typeof window !== 'undefined') {
  store.setUser(user);
  store.sock = user.isLoggedIn()
    ? new SockClient(getEndpoint(store.socketProxyPort, user.accessToken))
    : null;

  ReactDOM.render(
    <App i18n={i18n} store={store} />,
    document.getElementById('root')
  );
}

// hmr
if (module.hot) {
  module.hot.accept();
}

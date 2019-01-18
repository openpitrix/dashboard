// polyfills
import 'promise-polyfill/src/polyfill';
import '../lib/blob/Blob';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import RootStore from './stores/RootStore';
import SockClient from './utils/sock-client';
import i18n from './i18n';
import UserProvider from './providers/user';

const store = new RootStore(window.__INITIAL_STATE__);
store.registerStores();

// fix ssr notifications store not sync
store.notifications = [];

if (typeof window !== 'undefined') {
  const user = new UserProvider();

  let sc = null;
  // when logged in, setup socket client
  if (user.isLoggedIn()) {
    const sockEndpoint = SockClient.composeEndpoint(
      store.socketUrl,
      user.accessToken
    );
    sc = new SockClient(sockEndpoint);
    sc.setUp();
  }

  store.setUser(user);

  // window._getUser = () => Object.assign({}, user);
  // window._getStore = () => Object.assign({}, store);

  ReactDOM.render(
    <I18nextProvider i18n={i18n}>
      <MobxProvider rootStore={store} sock={sc}>
        <App />
      </MobxProvider>
    </I18nextProvider>,
    document.getElementById('root')
  );
}

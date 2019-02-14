// polyfills
import 'promise-polyfill/src/polyfill';
import '../lib/blob/Blob';

import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider as MobxProvider } from 'mobx-react';

import { getSock } from 'providers/sock-client';
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
    ? getSock(store.socketUrl, user.accessToken)
    : null;

  // fixme
  window._getSock = () => store.sock;

  ReactDOM.render(
    <I18nextProvider i18n={i18n}>
      <MobxProvider rootStore={store}>
        <App />
      </MobxProvider>
    </I18nextProvider>,
    document.getElementById('root')
  );
}

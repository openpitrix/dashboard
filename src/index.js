import 'isomorphic-fetch';
import 'core/logger';
import 'core/polyfills';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';

import App from './App';
import RootStore from './stores/RootStore';

const store = new RootStore(window.__INITIAL_STATE__);

render(
  <AppContainer>
    <BrowserRouter>
      <App rootStore={store} />
    </BrowserRouter>
  </AppContainer>,
  document.getElementById('root'),
);

module.hot && module.hot.accept();

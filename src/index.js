import 'isomorphic-fetch';
import 'lib/logger';
import 'lib/polyfills';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';

import App from './App';

import RootStore from './stores/RootStore';

const store = new RootStore(window.__INITIAL_STATE__);

const render = component => {
  ReactDOM.render(
    <AppContainer>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </AppContainer>
    , document.getElementById('root'));
};

render(<App rootStore={store} />);

module.hot && module.hot.accept('./App', () => {
  const NextApp = require('./App').default;
  render(<NextApp rootStore={store} />);
});

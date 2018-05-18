import 'isomorphic-fetch';
import 'lib/polyfills';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

import RootStore from './stores/RootStore';

const store = new RootStore(window.__INITIAL_STATE__);

if (typeof window !== 'undefined') {
  render(
    <BrowserRouter>
      <App rootStore={store} />
    </BrowserRouter>,
    document.getElementById('root')
  );
}

// todo: attach hmr,, deprecate react-hot-loader
// module.hot &&
//   module.hot.accept('./App', () => {
//     const NextApp = require('./App').default;
//     render(<NextApp rootStore={store} />);
//   });

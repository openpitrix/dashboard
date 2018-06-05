import 'lib/polyfills';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import RootStore from './stores/RootStore';

const store = new RootStore(window.__INITIAL_STATE__);

const render = Component => {
  ReactDOM.render(<BrowserRouter>{Component}</BrowserRouter>, document.getElementById('root'));
};

if (typeof window !== 'undefined') {
  render(<App rootStore={store} />);
}

// attach hmr, deprecate react-hot-loader
module.hot && module.hot.accept();

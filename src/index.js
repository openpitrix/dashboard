import 'lib/polyfills';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { withRouter } from 'react-router';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import App from './App';
import RootStore from './stores/RootStore';

import routes from './routes';
import renderRoute from './routes/renderRoute';

const store = new RootStore(window.__INITIAL_STATE__);

const AppWithRouter = withRouter(App);

if (typeof window !== 'undefined') {
  ReactDOM.render(
    <Provider rootStore={store} sessInfo={null}>
      <BrowserRouter>
        <AppWithRouter>
          <Switch>
            {routes.map((route, i) => (
              <Route
                key={i}
                exact={route.exact}
                path={route.path}
                render={({ match }) => renderRoute(match, route, store)}
              />
            ))}
          </Switch>
        </AppWithRouter>
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  );
}

// attach hmr, deprecate react-hot-loader
module.hot && module.hot.accept();

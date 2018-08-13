import 'lib/polyfills';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { withRouter } from 'react-router';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import Loadable from 'react-loadable';

import App from './App';
import RootStore from './stores/RootStore';
import SockClient from './utils/sock-client';
import renderRoute from './routes/renderRoute';
import i18n from './i18n';

const isProd = process.env.NODE_ENV === 'production';
const store = new RootStore(window.__INITIAL_STATE__);
store.registerStores();

if (typeof window !== 'undefined') {
  const AppWithRouter = withRouter(App);
  const dest=document.getElementById('root');
  const elem = routes =>
    <I18nextProvider i18n={i18n}>
    <Provider rootStore={store} sessInfo={null} sock={sc}>
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
    </Provider>
  </I18nextProvider>;

  const routeFile = isProd ? 'prod' : 'index';

  import(
    /* webpackChunkName: "routes" */
    /* webpackMode: "lazy" */
    `./routes/${routeFile}`
    ).then(({ default: routes }) => {

    const sockEndpoint = SockClient.composeEndpoint(store.socketUrl);
    try {
      sc = new SockClient(sockEndpoint);
      sc.setUp();

      if (!isProd) {
        window._sc = sc;
      }
    } catch (err) {
      console.warn(err);
    }

    if(isProd){
      Loadable.preloadReady().then(()=> {
        ReactDOM.hydrate(elem(routes), dest);
      })
    } else {
      ReactDOM.render(elem(routes), dest);
    }

    sc.setUp();

    if (!isProd) {
      window._sc = sc;
    }
  });
}

// attach hmr, deprecate react-hot-loader
// module.hot && module.hot.accept();

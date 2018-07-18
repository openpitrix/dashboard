import 'lib/polyfills';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { withRouter } from 'react-router';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import App from './App';
import RootStore from './stores/RootStore';
import routes from './routes';
import renderRoute from './routes/renderRoute';
import SockClient from './utils/sock-client';

const isDev = process.env.NODE_ENV !== 'production';
const store = new RootStore(window.__INITIAL_STATE__);
store.registerStores();

if (typeof window !== 'undefined') {
  const dest = document.getElementById('root');
  const AppWithRouter = withRouter(App);

  // lazy loading
  import('./i18n').then(({ default: i18n }) => {
    ReactDOM.render(
      <I18nextProvider i18n={i18n}>
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
        </Provider>
      </I18nextProvider>,
      dest
    );

    // setup websocket client
    const sockEndpoint=SockClient.composeEndpointFromApiServer(store.apiServer);
    const sc=new SockClient(sockEndpoint);
    sc.setUp();

    if(isDev){
      window._sc=sc;
    }

  });
}

// attach hmr, deprecate react-hot-loader
// module.hot && module.hot.accept();

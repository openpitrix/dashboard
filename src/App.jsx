import React, { lazy } from 'react';
import {
  Router, Switch, Route, Redirect
} from 'react-router-dom';

import { I18nextProvider } from 'react-i18next';
import { Provider as MobxProvider } from 'mobx-react';

import LazyLoad from 'components/LazyLoad';
import NotFound from 'components/NotFound';
import {
  UserRoutes, DevRoutes, IsvRoutes, AdminRoutes
} from 'routes/portals';
import WrapRoute from 'routes/WrapRoute';
import history from './createHistory';

import './scss/index.scss';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const AppDetail = lazy(() => import('./pages/AppDetail'));

class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <LazyLoad>
          <div className="main">
            <Switch>
              <WrapRoute path="/" component={Home} />
              <WrapRoute path="/login" component={Login} />
              <WrapRoute path="/apps/:appId" component={AppDetail} />

              <Route
                path="/user"
                render={({ match }) => <UserRoutes prefix={match.path} />}
              />

              <Route
                path="/dev"
                render={({ match }) => <DevRoutes prefix={match.path} />}
              />

              <Route
                path="/isv"
                render={({ match }) => <IsvRoutes prefix={match.path} />}
              />

              <Route
                path="/admin"
                render={({ match }) => <AdminRoutes prefix={match.path} />}
              />

              <Redirect from="/apps" exact to="/" />
              <WrapRoute component={NotFound} />
            </Switch>
          </div>
        </LazyLoad>
      </Router>
    );
  }
}

const AppContainer = ({ i18n, store }) => (
  <I18nextProvider i18n={i18n}>
    <MobxProvider rootStore={store}>
      <App />
    </MobxProvider>
  </I18nextProvider>
);

export default AppContainer;

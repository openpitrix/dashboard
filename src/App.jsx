import React, { lazy } from 'react';
import {
  Router, Switch, Route, Redirect
} from 'react-router-dom';

import LazyLoad from 'components/LazyLoad';
import NotFound from 'components/NotFound';

import Home from 'pages/Home';
import { Account } from 'pages/Dashboard';
import {
  UserRoutes, DevRoutes, IsvRoutes, AdminRoutes
} from 'routes';
import WrapRoute from 'routes/WrapRoute';

import history from './createHistory';

import './scss/index.scss';

const Login = lazy(() => import('./pages/Login'));
const AppDetail = lazy(() => import('./pages/AppDetail'));

export default class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <LazyLoad>
          <div className="main">
            <Switch>
              <WrapRoute path="/" component={Home} />
              <WrapRoute path="/login" component={Login} />
              <WrapRoute path="/apps/:appId" component={AppDetail} />
              <WrapRoute path="/profile/:type?" component={Account} />

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

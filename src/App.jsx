import React, { lazy } from 'react';
import {
  Router, Switch, Route, NavLink
} from 'react-router-dom';

import LazyLoad from 'components/LazyLoad';
import NotFound from 'components/NotFound';
import Home from 'pages/Home';
import { Account } from 'pages/Dashboard';
import routes, {
  UserRoutes, DevRoutes, IsvRoutes, AdminRoutes
} from 'routes';
import WrapRoute from 'routes/WrapRoute';

import history from './createHistory';

import './scss/index.scss';

const Login = lazy(() => import('./pages/Login'));
const AppDetail = lazy(() => import('./pages/AppDetail'));

// todo: mock
const Nav = () => (
  <ul>
    <li>
      <NavLink to="/">Dashboard</NavLink>
    </li>
  </ul>
);

export default class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <LazyLoad>
          <div className="main">
            {/* <Nav/> */}

            <Switch>
              <WrapRoute path={routes.home} exact component={Home} />
              <WrapRoute path={routes.login} component={Login} />
              <WrapRoute path={routes.appDetail} component={AppDetail} />
              <WrapRoute path={routes.profile} component={Account} />

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

              <Route component={NotFound} />
            </Switch>
          </div>
        </LazyLoad>
      </Router>
    );
  }
}

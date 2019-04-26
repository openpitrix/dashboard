import React, { lazy } from 'react';
import {
  Router, Switch, Route, Redirect
} from 'react-router-dom';
import { inject } from 'mobx-react';

import LazyLoad from 'components/LazyLoad';
import NotFound from 'components/NotFound';

import Home from 'pages/Home';
import {
  UserRoutes, DevRoutes, IsvRoutes, AdminRoutes
} from 'routes/portals';
import WrapRoute from 'routes/WrapRoute';

import history from './createHistory';

import './scss/index.scss';

const Login = lazy(() => import('./pages/Login'));
const AppDetail = lazy(() => import('./pages/AppDetail'));

@inject(({ rootStore }) => ({
  roleStore: rootStore.roleStore
}))
export default class App extends React.Component {
  state = {
    isLoading: true
  };

  async componentDidMount() {
    await this.props.roleStore.setRoleSession();
    this.setState({
      isLoading: false
    });
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }

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

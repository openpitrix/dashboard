import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'mobx-react';

import Header from 'components/Header';
import Footer from 'components/Footer';
import RouteWrapper from './routes/wrapper';
import routes from './routes';
import { getCookie } from './utils';

import './scss/main.scss';

class App extends Component {
  static propTypes = {
    rootStore: PropTypes.object
  };

  render() {
    const { location, rootStore } = this.props;
    const pathname = location.pathname;

    const isHome = pathname === '/' || pathname === '/apps';
    const isLogin = pathname === '/login';
    const hasLoggedIn = !!getCookie('user');

    return (
      <Provider rootStore={rootStore}>
        <div>
          {!isLogin && <Header isHome={isHome} />}
          <div className="main">
            <Switch>
              {routes.map((route, i) => (
                <Route
                  key={i}
                  exact={route.exact}
                  path={route.path}
                  render={({ match }) =>
                    route.needAuth && !hasLoggedIn ? (
                      <Redirect to="/login" />
                    ) : (
                      <RouteWrapper
                        component={route.component}
                        match={match}
                        rootStore={rootStore}
                      />
                    )
                  }
                />
              ))}
            </Switch>
          </div>
          {!isLogin && <Footer />}
        </div>
      </Provider>
    );
  }
}

export default withRouter(App);

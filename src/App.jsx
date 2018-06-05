import React, { Fragment, Component } from 'react';
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

const bypassUrl = ['/deployment'];
const validManageTypes = ['develop', 'manage'];

class App extends Component {
  static propTypes = {
    rootStore: PropTypes.object
  };

  hasLoggedIn = () => {
    return !!getCookie('user');
  };

  renderRoute = (match, route) => {
    const { rootStore } = this.props;
    const { params } = match;

    if (route.needAuth && !this.hasLoggedIn()) {
      return <Redirect to="/login" />;
    }
    if (route.noMatch && bypassUrl.indexOf(match.url) < 0) {
      return <Redirect to="/" />;
    }

    if (params.manage && validManageTypes.indexOf(params.manage) < 0) {
      return <Redirect to="/" />;
    }

    return <RouteWrapper component={route.component} match={match} rootStore={rootStore} />;
  };

  render() {
    const { location, rootStore } = this.props;
    const pathname = location.pathname;

    const isHome = pathname === '/' || pathname === '/apps';
    const isLogin = pathname === '/login';

    return (
      <Provider rootStore={rootStore}>
        <Fragment>
          {!isLogin && <Header isHome={isHome} />}

          <div className="main">
            <Switch>
              {routes.map((route, i) => (
                <Route
                  key={i}
                  exact={route.exact}
                  path={route.path}
                  render={({ match }) => this.renderRoute(match, route)}
                />
              ))}
            </Switch>
          </div>

          {!isLogin && <Footer />}
        </Fragment>
      </Provider>
    );
  }
}

export default withRouter(App);

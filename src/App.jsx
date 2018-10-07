import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Provider } from 'mobx-react';
import { withRouter } from 'react-router';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import Header from 'components/Header';
import Footer from 'components/Footer';

import WrapComp from './routes/wrapper';

import { getCookie, setCookie } from 'utils';

import './scss/index.scss';

class App extends React.Component {
  static propTypes = {
    routes: PropTypes.array.isRequired,
    store: PropTypes.object.isRequired,
    i18n: PropTypes.object,
    sock: PropTypes.any
  };

  static defaultProps = {
    routes: [],
    store: {},
    i18n: {},
    sock: null
  };

  renderRoute(match, route, store) {
    if (route.path === 'login') {
      setCookie('user', '', -1);
      setCookie('role', '', -1);
    }

    const user = store.user || {};
    const role = getCookie('role');
    const hasHeader = user.isNormal || !user.username || role === 'user';

    if (route.needAuth && !Boolean(user.username)) {
      return <Redirect to={`/login?url=${match.url}`} />;
    }

    if (route.noMatch) {
      return <Redirect to="/" />;
    }

    const props = {
      component: withRouter(route.component),
      rootStore: store,
      match
    };

    if (route.path !== '/login') {
      const isHome = route.path === '/' || route.path.toString().startsWith('/app');

      return (
        <Fragment>
          {(hasHeader || isHome) && <Header isHome={isHome} />}
          <WrapComp {...props} />
          {(hasHeader || isHome) && <Footer />}
        </Fragment>
      );
    }

    return <WrapComp {...props} />;
  }

  render() {
    const { routes, store, sock, i18n } = this.props;

    return (
      <I18nextProvider i18n={i18n}>
        <Provider rootStore={store} sock={sock}>
          <BrowserRouter>
            <div className="main">
              <Switch>
                {routes.map((route, i) => (
                  <Route
                    key={i}
                    exact={route.exact}
                    path={route.path}
                    render={({ match }) => this.renderRoute(match, route, store)}
                  />
                ))}
              </Switch>
            </div>
          </BrowserRouter>
        </Provider>
      </I18nextProvider>
    );
  }
}

export default App;

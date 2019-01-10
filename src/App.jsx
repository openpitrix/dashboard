import React from 'react';
import PropTypes from 'prop-types';

import { Provider } from 'mobx-react';
import { withRouter } from 'react-router';
import {
  BrowserRouter, Switch, Route, Redirect
} from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import LazyLoad from 'components/LazyLoad';
import Header from 'components/Header';
import Footer from 'components/Footer';

import WrapComp from './routes/wrapper';

import './scss/index.scss';

const noHeaderPath = ['/dashboard/provider/submit'];

class App extends React.Component {
  static propTypes = {
    i18n: PropTypes.object,
    routes: PropTypes.array.isRequired,
    sock: PropTypes.any,
    store: PropTypes.object.isRequired
  };

  static defaultProps = {
    routes: [],
    store: {},
    i18n: {},
    sock: null
  };

  renderRoute(match, route, store) {
    const user = store.user || {};
    const { search } = location;

    // todo
    // add noHeaderPath for user apply provider from page no need header
    const hasHeader = !noHeaderPath.includes(route.path)
      && (user.isNormal || !user.accessToken);

    if (route.noMatch) {
      return <Redirect to="/" />;
    }

    if (route.needAuth && !user.isLoggedIn()) {
      return <Redirect to={`/login?redirect_url=${match.path}`} />;
    }

    const props = {
      component: withRouter(route.component),
      rootStore: store,
      match,
      search
    };

    if (route.path !== '/login') {
      const isHome = route.applyHome || route.component.isHome;

      return (
        <LazyLoad>
          {(hasHeader || isHome) && <Header />}
          <WrapComp {...props} />
          {(hasHeader || isHome) && <Footer />}
        </LazyLoad>
      );
    }

    return <WrapComp {...props} />;
  }

  render() {
    const {
      routes, store, sock, i18n
    } = this.props;

    return (
      <I18nextProvider i18n={i18n}>
        <Provider rootStore={store} sock={sock}>
          <BrowserRouter>
            <div className="main">
              <LazyLoad>
                <Switch>
                  {routes.map((route, i) => (
                    <Route
                      key={i}
                      exact={route.exact}
                      path={route.path}
                      render={({ match }) => this.renderRoute(match, route, store)
                      }
                    />
                  ))}
                </Switch>
              </LazyLoad>
            </div>
          </BrowserRouter>
        </Provider>
      </I18nextProvider>
    );
  }
}

export default App;

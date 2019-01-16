import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Provider } from 'mobx-react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import LazyLoad from 'components/LazyLoad';
import Header from 'components/Header';
import Footer from 'components/Footer';
import ErrorBoundary from 'components/ErrorBoundary';
import Wrapper from 'routes/wrapper';

import './scss/index.scss';

// fixme
const noHeaderPath = ['/dashboard/provider/submit'];

const WrapRoute = ({ component: Comp, ...rest }) => {
  const {
    path, store, computedMatch, needAuth, noMatch
  } = rest;
  const user = store.user || {};

  // todo
  const hasHeader = path !== '/login'
    && !noHeaderPath.includes(path)
    && (user.isNormal || !user.accessToken);

  if (noMatch) {
    return <Redirect to="/" />;
  }

  if (needAuth && !user.isLoggedIn()) {
    return <Redirect to={`/login?redirect_url=${computedMatch.url || ''}`} />;
  }

  const isHome = rest.applyHome || Comp.isHome;
  let { acl } = rest;

  if (!_.isEmpty(acl)) {
    acl = [].concat(acl);
    if (!_.some(acl, role => user[`is${role}`])) {
      return <Redirect to="/" />;
    }
  }

  return (
    <Route
      {...rest}
      render={props => (
        <ErrorBoundary>
          {(hasHeader || isHome) && <Header />}
          <Wrapper comp={Comp} {...props} rootStore={store} />
          {(hasHeader || isHome) && <Footer />}
        </ErrorBoundary>
      )}
    />
  );
};

class App extends React.Component {
  static propTypes = {
    i18n: PropTypes.object,
    routes: PropTypes.array.isRequired,
    store: PropTypes.object.isRequired
  };

  static defaultProps = {
    routes: [],
    store: {},
    i18n: {}
  };

  render() {
    const {
      routes, store, sock, i18n
    } = this.props;

    return (
      <I18nextProvider i18n={i18n}>
        <Provider rootStore={store} sock={sock}>
          <Router>
            <div className="main">
              <LazyLoad>
                <Switch>
                  {routes.map(route => (
                    <WrapRoute {...route} store={store} key={route.path} />
                  ))}
                </Switch>
              </LazyLoad>
            </div>
          </Router>
        </Provider>
      </I18nextProvider>
    );
  }
}

export default App;

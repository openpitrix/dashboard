import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';

import Header from 'components/Header';
import Banner from 'components/Banner';
import Footer from 'components/Footer';
import routes from './routes';

import 'bootstrap/dist/css/bootstrap.css';
import './scss/main.scss';

class App extends Component {
  static propTypes = {
    rootStore: PropTypes.object,
  };

  render() {
    const { location, rootStore } = this.props;

    const isHome = location.pathname === '/';

    return (
      <Provider rootStore={rootStore}>
        <div>
          <Header isHome={isHome}/>
          {isHome && <Banner />}
          <div className="main">
            <Switch>
              {routes.map((route, i) => <Route key={i} exact {...route}/>)}
            </Switch>
          </div>
          <Footer />
        </div>
      </Provider>
    );
  }
}

export default withRouter(App);

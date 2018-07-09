import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Header';
import Footer from 'components/Footer';

import './scss/main.scss';

class App extends PureComponent {
  static propTypes = {
    rootStore: PropTypes.object,
    location: PropTypes.object
  };

  static defaultProps = {
    rootStore: {},
    location: {}
  };

  render() {
    const { location, children } = this.props;
    const pathname = location.pathname;
    const isLoginPage = pathname === '/login';
    const isHome =
      pathname === '/' || pathname === '/apps' || (pathname && pathname.indexOf('apps/ctg-') > -1);

    return (
      <Fragment>
        {!isLoginPage && <Header isHome={isHome} />}
        <div className="main">{children}</div>
        {!isLoginPage && <Footer />}
      </Fragment>
    );
  }
}

export default App;

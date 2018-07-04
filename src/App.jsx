import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

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
    const isHome = pathname === '/' || pathname === '/apps';

    return (
      <I18nextProvider i18n={i18n}>
        <Fragment>
          {!isLoginPage && <Header isHome={isHome} />}
          <div className="main">{children}</div>
          {!isLoginPage && <Footer />}
        </Fragment>
      </I18nextProvider>
    );
  }
}

export default App;

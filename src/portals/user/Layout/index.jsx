import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Header from 'components/Header';
import Footer from 'components/Footer';
import { Notification } from 'components/Base';

import styles from './index.scss';

export default class UserPortalLayout extends React.PureComponent {
  static propTypes = {
    banner: PropTypes.node,
    className: PropTypes.string,
    hideFooter: PropTypes.bool
  };

  static defaultProps = {
    hideFooter: false,
    banner: null
  };

  render() {
    const { children, banner, className } = this.props;

    return (
      <Fragment>
        <Notification />
        <Header />
        {banner}
        <div className={classnames(styles.page, className)}>{children}</div>
        {!this.props.hideFooter && <Footer />}
      </Fragment>
    );
  }
}

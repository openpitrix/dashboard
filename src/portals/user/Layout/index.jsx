import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Header from 'components/Header';

import styles from './index.scss';

export default class UserPortalLayout extends React.PureComponent {
  static propTypes = {
    banner: PropTypes.node,
    className: PropTypes.string
  };

  static defaultProps = {
    banner: null
  };

  render() {
    const { children, banner, className } = this.props;

    return (
      <Fragment>
        <Header />
        {banner}
        <div className={classnames(styles.page, className)}>{children}</div>
      </Fragment>
    );
  }
}

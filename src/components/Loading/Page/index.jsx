import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class PageLoading extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    isLoading: PropTypes.bool
  };

  static defaultProps = {
    isLoading: true
  };

  render() {
    const { className, isLoading, children } = this.props;

    if (isLoading) {
      return (
        <div className={classnames(styles.page, className)}>
          <div className={styles.loadOuter}>
            <div className={styles.loader} />
          </div>
        </div>
      );
    }

    if (!children) {
      return null;
    }

    return <Fragment>{children}</Fragment>;
  }
}

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class Loading extends Component {
  static propTypes = {
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    children: PropTypes.node
  };

  static defaultProps = {
    isLoading: false
  };

  render() {
    const { className, isLoading, children } = this.props;

    if (isLoading) {
      return (
        <div className={classnames(styles.loading, className)}>
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

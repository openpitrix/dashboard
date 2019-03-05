import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon } from 'components/Base';

import styles from './index.scss';

export default class Loading extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    loaderCls: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  static defaultProps = {
    isLoading: false,
    size: 36
  };

  render() {
    const {
      className, isLoading, children, loaderCls, size
    } = this.props;

    if (isLoading) {
      return (
        <Fragment>
          <div className={classnames(styles.loading, className)}>
            <Icon
              name="loading"
              size={size}
              type="dark"
              className={loaderCls}
            />
          </div>
        </Fragment>
      );
    }

    return <Fragment>{children}</Fragment>;
  }
}

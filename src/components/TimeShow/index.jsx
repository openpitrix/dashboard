import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { formatTime } from 'utils';
import styles from './index.scss';

export default class TimeShow extends Component {
  static propTypes = {
    time: PropTypes.string,
    type: PropTypes.oneOf(['listTime', 'detailTime', 'lineTime'])
  };

  static defaultProps = {
    type: 'listTime'
  };

  render() {
    const { time, type } = this.props;

    return (
      <Fragment>
        <div className={styles[type]}>{formatTime(time)}</div>
        <div className={styles[type]}>{formatTime(time, 'HH:mm:ss')}</div>
      </Fragment>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { formatTime } from 'utils';

import styles from './index.scss';

export default class TimeShow extends Component {
  static propTypes = {
    format: PropTypes.oneOf(['YYYY/MM/DD', 'YYYY/MM/DD HH:mm:ss']),
    time: PropTypes.string,
    type: PropTypes.oneOf(['listTime', 'detailTime', 'lineTime'])
  };

  static defaultProps = {
    format: 'YYYY/MM/DD HH:mm:ss',
    type: 'detailTime'
  };

  render() {
    const { time, format, type } = this.props;

    return <div className={styles[type]}>{formatTime(time, format)}</div>;
  }
}

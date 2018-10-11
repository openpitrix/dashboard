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

    const trans = {
      listTime: 'YYYY/MM/DD',
      detailTime: 'YYYY/MM/DD HH:mm:ss',
      lineTime: 'HH:mm:ss'
    };

    return (
      <Fragment>
        <div className={styles[type]}>{formatTime(time, trans[type])}</div>
      </Fragment>
    );
  }
}

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { getParseDate, getParseTime } from 'utils';
import styles from './index.scss';

export default class TimeShow extends Component {
  static propTypes = {
    time: PropTypes.string,
    type: PropTypes.oneOf(['listTime', 'detailTime'])
  };

  static defaultProps = {
    type: 'listTime'
  };

  render() {
    const { time, type } = this.props;

    return (
      <Fragment>
        <div className={styles[type]}>{getParseDate(time)}</div>
        <div className={styles[type]}>{getParseTime(time)}</div>
      </Fragment>
    );
  }
}

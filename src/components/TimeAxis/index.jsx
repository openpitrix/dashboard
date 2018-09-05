import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { formatTime } from 'utils';

import styles from './index.scss';

export default class TimeAxis extends PureComponent {
  static propTypes = {
    timeList: PropTypes.array
  };

  render() {
    const { timeList } = this.props;

    return (
      <div className={styles.timeAxis}>
        <ul className={styles.axis}>
          {timeList &&
            timeList.map((item, index) => (
              <li key={index}>
                <div className={styles.word}>{item.job_action}</div>
                <div className={styles.time}>{formatTime(item.create_time)}</div>
                <span className={classnames(styles.dot, styles[item.status])} />
              </li>
            ))}
        </ul>
      </div>
    );
  }
}

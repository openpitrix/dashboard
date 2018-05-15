import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

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
          {timeList.map((time, index) => (
            <li key={index}>
              <div className={styles.word}>{time.name}</div>
              <div className={styles.time}>{time.time}</div>
              <span className={styles.dot} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

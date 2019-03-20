import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';

import { formatTime } from 'utils';

import styles from './index.scss';

@withTranslation()
export default class TimeAxis extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    timeList: PropTypes.array
  };

  static defaultProps = {
    timeList: []
  };

  render() {
    const { className, timeList, t } = this.props;

    return (
      <div className={classnames(styles.timeAxis, className)}>
        <ul className={styles.axis}>
          {timeList.map((item, index) => (
            <li key={index}>
              <div className={styles.title}>{t(item.job_action)}</div>
              <div className={styles.time}>
                {formatTime(item.create_time, 'YYYY/MM/DD HH:mm:ss')}
              </div>
              <span className={classnames(styles.dot, styles[item.status])} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

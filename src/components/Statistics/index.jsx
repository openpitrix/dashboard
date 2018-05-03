import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Histogram from '../Statistics/Histogram';
import Progress from '../Statistics/Progress';
import styles from './index.scss';

export default class Statistics extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { image, name, total1, centerName, total2, progress, total3, histogram } = this.props;
    return (
      <div className={styles.statistics}>
        <div className={styles.warper}>
          <div className={styles.module}>
            <div className={styles.apps}>
              <img src={image || 'http://via.placeholder.com/30x24'} className={styles.icon} />
              {name}
            </div>
            <div className={classnames(styles.word, styles.fl)}>
              <div className={styles.name}>Total</div>
              <div className={styles.number}>{total1}</div>
            </div>
            <div className={classnames(styles.line)} />
          </div>
          <div className={styles.module}>
            <div className={styles.word}>
              <div className={styles.name}>{centerName}</div>
              <div className={styles.number}>{total2}</div>
            </div>
            <Progress progressArray={progress} />
            <div className={classnames(styles.line)} />
          </div>
          <div className={styles.module}>
            <div className={styles.word}>
              <div className={styles.name}>Lasted 2 Weeks</div>
              <div className={styles.number}>{total3}</div>
            </div>
            <Histogram dataArray={histogram} />
          </div>
        </div>
      </div>
    );
  }
}

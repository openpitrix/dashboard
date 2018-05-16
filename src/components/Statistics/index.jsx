import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Histogram from './Histogram';
import Progress from './Progress';
import styles from './index.scss';

export default class Statistics extends PureComponent {
  static propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
    total: PropTypes.number,
    centerName: PropTypes.string,
    progressTotal: PropTypes.number,
    progress: PropTypes.array,
    lastedTotal: PropTypes.number,
    histograms: PropTypes.array
  };

  render() {
    const {
      image,
      name,
      total,
      centerName,
      progressTotal,
      progress,
      lastedTotal,
      histograms
    } = this.props;
    return (
      <div className={styles.statistics}>
        <div className={styles.wrap}>
          <div className={styles.module}>
            <div className={styles.apps}>
              <img src={image} className={styles.icon} />
              {name}
            </div>
            <div className={classnames(styles.word, styles.fl)}>
              <div className={styles.name}>Total</div>
              <div className={styles.number}>{total}</div>
            </div>
            <div className={classnames(styles.line)} />
          </div>
          <div className={styles.module}>
            <div className={styles.word}>
              <div className={styles.name}>{centerName}</div>
              <div className={styles.number}>{progressTotal}</div>
            </div>
            {progress && <Progress progress={progress} />}
            <div className={classnames(styles.line)} />
          </div>
          <div className={styles.module}>
            <div className={styles.word}>
              <div className={styles.name}>Lasted 2 Weeks</div>
              <div className={styles.number}>{lastedTotal}</div>
            </div>
            {histograms && <Histogram histograms={histograms} />}
          </div>
        </div>
      </div>
    );
  }
}

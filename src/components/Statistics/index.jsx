import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { Icon } from 'components/Base';
import {
  getStasTotal, getTopTotal, getProgress, getHistograms
} from 'utils';
import Histogram from './Histogram';
import Progress from './Progress';

import styles from './index.scss';

@withTranslation()
export default class Statistics extends PureComponent {
  static propTypes = {
    centerName: PropTypes.string,
    histograms: PropTypes.object,
    iconName: PropTypes.string,
    name: PropTypes.string,
    objs: PropTypes.array,
    progress: PropTypes.object,
    progressTotal: PropTypes.number,
    total: PropTypes.number
  };

  static defaultProps = {
    name: 'Apps',
    iconName: 'appcenter',
    total: 0,
    centerName: 'Repos',
    progressTotal: 0
  };

  render() {
    const {
      name,
      iconName,
      total,
      centerName,
      progressTotal,
      progress,
      histograms,
      objs,
      t
    } = this.props;

    const topList = getProgress(progress);
    const lastList = getHistograms(histograms);
    const topTotal = getTopTotal(topList);
    const lastedTotal = getStasTotal(histograms);

    return (
      <div className={styles.statistics}>
        <div className={styles.module}>
          <div className={styles.apps}>
            <Icon
              name={iconName}
              size="medium"
              className={styles.icon}
              type={'light'}
            />
            {t(name)}
          </div>
          <div className={styles.word}>
            <div className={styles.name}>{t('Total')}</div>
            <div className={styles.number}>{total}</div>
          </div>
        </div>

        <div className={styles.module}>
          <div className={styles.word}>
            <div className={styles.name}>{t(centerName)}</div>
            <div className={styles.number}>{progressTotal}</div>
          </div>
          <Progress
            progress={topList}
            total={topTotal}
            type={name}
            objs={objs}
          />
        </div>

        <div className={styles.module}>
          <div className={styles.word}>
            <div className={styles.name}>{t('Lasted 2 Weeks')}</div>
            <div className={styles.number}>{lastedTotal || 0}</div>
          </div>
          <Histogram histograms={lastList} />
        </div>
      </div>
    );
  }
}

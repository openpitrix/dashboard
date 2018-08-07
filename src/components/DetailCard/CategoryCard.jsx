import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import TimeShow from 'components/TimeShow';
import CopyId from './CopyId';
import styles from './index.scss';

@translate()
export default class CategoryCard extends PureComponent {
  static propTypes = {
    detail: PropTypes.object,
    appCount: PropTypes.number
  };

  render() {
    const { detail, appCount, t } = this.props;

    return (
      <div className={styles.detailCard}>
        <div className={classnames(styles.title, styles.noImg)}>
          <div className={styles.name} title={detail.name}>
            {detail.name}
          </div>
          <CopyId id={detail.category_id} />
          <div className={styles.description}>{detail.description}</div>
        </div>
        <ul className={styles.detail}>
          <li>
            <span className={styles.name}>{t('Creator')}</span>
            {detail.owner}
          </li>
          <li>
            <span className={styles.name}>{t('App Count')}</span>
            {appCount}
          </li>
          <li>
            <span className={styles.name}>{t('Date Updated')}</span>
            <TimeShow time={detail.create_time} type="detailTime" />
          </li>
        </ul>
      </div>
    );
  }
}

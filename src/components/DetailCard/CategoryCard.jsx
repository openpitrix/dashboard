import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Status from 'components/Status';
import { getParseDate } from 'utils';
import styles from './index.scss';

export default class CategoryCard extends PureComponent {
  static propTypes = {
    detail: PropTypes.object.isRequired,
    appCount: PropTypes.number
  };

  render() {
    const { detail, appCount } = this.props;
    return (
      <div className={styles.detailCard}>
        <div className={classnames(styles.title, styles.noImg)}>
          <div className={styles.name}>{detail.name}</div>
          <div className={styles.caId}>id:{detail.category_id}</div>
        </div>
        <ul className={styles.detail}>
          <li>
            <span className={styles.name}>Status</span>
            <Status name={detail.status} type={detail.status} />
          </li>
          <li>
            <span className={styles.name}>Creator</span>
            {detail.owner}
          </li>
          <li>
            <span className={styles.name}>App Count</span>
            {appCount}
          </li>
          <li>
            <span className={styles.name}>Date Updated</span>
            {getParseDate(detail.update_time)}
          </li>
        </ul>
      </div>
    );
  }
}

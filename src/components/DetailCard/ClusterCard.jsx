import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Status from 'components/Status';
import { getParseDate } from 'utils';
import styles from './index.scss';

export default class ClusterCard extends PureComponent {
  static propTypes = {
    detail: PropTypes.object.isRequired
  };

  render() {
    const { detail } = this.props;
    return (
      <div className={styles.detailCard}>
        <div className={classnames(styles.title, styles.noImg)}>
          <div className={styles.name}>{detail.name}</div>
          <div className={styles.caId}>id:{detail.cluster_id}</div>
        </div>
        <ul className={styles.detail}>
          <li>
            <span className={styles.name}>Status</span>
            <Status name={detail.status} type={detail.status} />
          </li>
          <li>
            <span className={styles.name}>Runtime</span>
            {detail.runtime_id}
          </li>
          <li>
            <span className={styles.name}>App</span>
            {detail.app_id}
          </li>
          <li>
            <span className={styles.name}>User</span>
            {detail.owner}
          </li>
          <li>
            <span className={styles.name}>Node Count</span>
            {detail.count}
          </li>
          <li>
            <span className={styles.name}>Date Updated</span>
            {getParseDate(detail.upgrade_time)}
          </li>
        </ul>
      </div>
    );
  }
}

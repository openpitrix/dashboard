import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import Status from 'components/Status';
import TimeShow from 'components/TimeShow';
import CopyId from './CopyId';
import styles from './index.scss';

export default class ClusterCard extends PureComponent {
  static propTypes = {
    detail: PropTypes.object.isRequired,
    appName: PropTypes.string,
    runtimeName: PropTypes.string
  };

  render() {
    const { detail, appName, runtimeName } = this.props;

    return (
      <div className={styles.detailCard}>
        <div className={classnames(styles.title, styles.noImg)}>
          <div className={styles.name}>{detail.name}</div>
          <CopyId id={detail.cluster_id} />
        </div>
        <ul className={styles.detail}>
          {detail.frontgate_id && (
            <li>
              <span className={styles.name}>Frontgate ID</span>
              {detail.frontgate_id}
            </li>
          )}
          <li>
            <span className={styles.name}>Status</span>
            <Status name={detail.status} type={detail.status} />
          </li>
          <li>
            <span className={styles.name}>Runtime</span>
            <Link to={`/dashboard/runtime/${detail.runtime_id}`}>{runtimeName}</Link>
          </li>
          <li>
            <span className={styles.name}>App</span>
            <Link to={`/dashboard/app/${detail.app_id}`}>{appName}</Link>
          </li>
          <li>
            <span className={styles.name}>User</span>
            {detail.owner}
          </li>
          <li>
            <span className={styles.name}>Node Count</span>
            {(detail.cluster_node_set && detail.cluster_node_set.length) || 0}
          </li>
          <li>
            <span className={styles.name}>Date Updated</span>
            <TimeShow time={detail.upgrade_time} type="detailTime" />
          </li>
        </ul>
      </div>
    );
  }
}

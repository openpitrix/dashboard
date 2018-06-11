import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getPastTime } from 'utils';
import styles from './index.scss';

export default class ClusterList extends PureComponent {
  static propTypes = {
    clusters: PropTypes.array
  };

  render() {
    const { clusters } = this.props;
    return (
      <ul className={styles.clusterList}>
        {clusters.map(data => (
          <li key={data.cluster_id}>
            <img className={styles.icon} src={data.icon} />
            <div className={styles.word}>
              <div className={styles.name}>{data.name}</div>
              <div className={styles.detail}>
                <span className={styles.description} title={data.description}>
                  {data.description}
                </span>
                <span className={styles.nodes}>{data.node_count} Nodes</span>
                <span className={styles.time}>{getPastTime(data.status_time)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

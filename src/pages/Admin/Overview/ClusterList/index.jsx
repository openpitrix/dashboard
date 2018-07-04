import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getPastTime, imgPlaceholder } from 'utils';
import styles from './index.scss';

export default class ClusterList extends PureComponent {
  static propTypes = {
    clusters: PropTypes.array
  };

  render() {
    const { clusters } = this.props;
    const imgPhd = imgPlaceholder(20);
    return (
      <ul className={styles.clusterList}>
        {clusters.map(data => (
          <li key={data.cluster_id}>
            <img className={styles.icon} src={data.icon || imgPhd} />
            <div className={styles.word}>
              <Link className={styles.name} to={`/dashboard/cluster/${data.cluster_id}`}>
                {data.name}
              </Link>
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

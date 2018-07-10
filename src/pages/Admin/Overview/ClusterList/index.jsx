import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { getPastTime, imgPlaceholder } from 'utils';
import styles from './index.scss';

export default class ClusterList extends PureComponent {
  static propTypes = {
    clusters: PropTypes.array,
    isAdmin: PropTypes.bool
  };

  render() {
    const { clusters, isAdmin } = this.props;
    const imgPhd = imgPlaceholder(20);
    return (
      <ul className={classNames(styles.clusterList, { [styles.normalList]: !isAdmin })}>
        {clusters.map(data => (
          <li key={data.cluster_id}>
            <img className={styles.icon} src={data.icon || imgPhd} />
            <div className={styles.word}>
              <Link className={styles.name} to={`/dashboard/cluster/${data.cluster_id}`}>
                {data.name}
              </Link>
              <div className={styles.detail}>
                <span className={styles.description} title={data.description}>
                  {data.description}&nbsp;
                </span>
                <span className={styles.nodes}>
                  {(data.cluster_node_set && data.cluster_node_set.length) || 0} Nodes
                </span>
                <span className={styles.time}>{getPastTime(data.status_time)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

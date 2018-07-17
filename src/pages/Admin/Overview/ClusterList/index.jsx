import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import { getPastTime, imgPlaceholder } from 'utils';

import styles from './index.scss';

@translate()
export default class ClusterList extends PureComponent {
  static propTypes = {
    clusters: PropTypes.array,
    isAdmin: PropTypes.bool
  };

  render() {
    const { clusters, isAdmin, t } = this.props;
    const imgPhd = imgPlaceholder(20);

    return (
      <ul className={classNames(styles.clusterList, { [styles.normalList]: !isAdmin })}>
        {clusters.map(cluster => (
          <li key={cluster.cluster_id}>
            <img className={styles.icon} src={cluster.icon || imgPhd} />
            <div className={styles.word}>
              <Link className={styles.name} to={`/dashboard/cluster/${cluster.cluster_id}`}>
                {cluster.name}
              </Link>
              <div className={styles.detail}>
                <span className={styles.description} title={cluster.description}>
                  {cluster.description}&nbsp;
                </span>
                <span className={styles.nodes}>
                  {(cluster.cluster_node_set && cluster.cluster_node_set.length) || 0} {t('Nodes')}
                </span>
                <span className={styles.time}>{getPastTime(cluster.status_time)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

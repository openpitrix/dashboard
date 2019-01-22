import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import { getPastTime } from 'utils';
import routes, { toRoute } from 'routes';

import styles from './index.scss';

@translate()
export default class ClusterList extends PureComponent {
  static propTypes = {
    clusters: PropTypes.array,
    isAdmin: PropTypes.bool,
    isNormal: PropTypes.bool
  };

  renderStatusDot(status) {
    return <span className={classNames(styles.statusDot, styles[status])} />;
  }

  render() {
    const { clusters, isNormal, t } = this.props;

    return (
      <ul className={styles.clusterList}>
        {clusters.map(cluster => (
          <li key={cluster.cluster_id}>
            <div className={styles.dot}>
              {this.renderStatusDot(cluster.status)}
            </div>
            <div className={styles.word}>
              <Link
                className={styles.name}
                to={toRoute(routes.portal.clusterDetail, {
                  clusterId: cluster.cluster_id
                })}
              >
                {cluster.name}
              </Link>
              <div className={styles.description} title={cluster.description}>
                {cluster.description}&nbsp;
              </div>
            </div>
            <div className={styles.total}>
              <div className={styles.nodes}>
                {(cluster.cluster_node_set
                  && cluster.cluster_node_set.length)
                  || 0}{' '}
                {t('Nodes')}
              </div>
              <span className={styles.time}>
                {getPastTime(cluster.status_time)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getPastTime } from 'utils';
import styles from './index.scss';

export default class LiClusters extends PureComponent {
  static propTypes = {
    clustersData: PropTypes.array
  };

  render() {
    const { clustersData } = this.props;
    return (
      <ul className={styles.liApps}>
        {clustersData.map((data, index) => (
          <li key={index}>
            <img className={styles.icon} src={data.icon || 'http://via.placeholder.com/16x16'} />
            <div className={styles.word}>
              <div className={styles.name}>{data.name}</div>
              <div className={styles.detail}>
                <span className={styles.description} title={data.description}>
                  {data.description}
                </span>
                <span className={styles.nodes}>{data.node_count} Nodes</span>
                <span className={styles.time}>{getPastTime(data.last_modified)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

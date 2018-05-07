import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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
            <img className={styles.icon} src={data.icon || 'http://via.placeholder.com/16x1'} />
            <div className={styles.word}>
              <div className={styles.name}>{data.name}</div>
              <div className={styles.detail}>
                <span className={styles.description}>{data.description}</span>
                <span className={styles.nodes}>{data.nodes} Nodes</span>
                <span className={styles.time}>{data.time}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

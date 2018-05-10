import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TdName from '../TdName';
import styles from './index.scss';

export default class LiApps extends PureComponent {
  static propTypes = {
    appsData: PropTypes.array
  };

  render() {
    const { appsData } = this.props;
    return (
      <ul className={styles.liApps}>
        {appsData.map((data, index) => (
          <li key={index}>
            <span className={styles.order}>{index + 1}</span>
            <TdName
              image={data.icon || 'http://via.placeholder.com/24x24'}
              name={data.name}
              description={data.description}
            />
            <span className={styles.total}>
              <span className={styles.number}>{data.total || 0}</span> Clusters
            </span>
          </li>
        ))}
      </ul>
    );
  }
}

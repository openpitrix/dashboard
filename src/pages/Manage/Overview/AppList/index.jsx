import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TdName from 'components/TdName/index';
import styles from './index.scss';

export default class AppList extends PureComponent {
  static propTypes = {
    apps: PropTypes.array
  };

  render() {
    const { apps } = this.props;
    return (
      <ul className={styles.appList}>
        {apps.map((data, index) => (
          <li key={data.app_id}>
            <span className={styles.order}>{index + 1}</span>
            <TdName image={data.icon} name={data.name} description={data.description} />
            <span className={styles.total}>
              <span className={styles.number}>{data.total || 0}</span> Clusters
            </span>
          </li>
        ))}
      </ul>
    );
  }
}

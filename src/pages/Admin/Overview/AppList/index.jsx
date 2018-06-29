import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TdName from 'components/TdName/index';
import styles from './index.scss';
import { imgPlaceholder } from 'utils';

export default class AppList extends PureComponent {
  static propTypes = {
    apps: PropTypes.array
  };

  render() {
    const { apps } = this.props;
    const imgPhd = imgPlaceholder(24);
    return (
      <ul className={styles.appList}>
        {apps.map((data, index) => (
          <li key={data.app_id}>
            <span className={styles.order}>{index + 1}</span>
            <TdName
              image={data.icon || imgPhd}
              name={data.name}
              description={data.description}
              linkUrl={`/dashboard/app/${data.app_id}`}
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

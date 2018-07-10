import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import TdName from 'components/TdName/index';
import styles from './index.scss';
import { imgPlaceholder } from 'utils';

export default class AppList extends PureComponent {
  static propTypes = {
    apps: PropTypes.array,
    isAdmin: PropTypes.bool
  };

  render() {
    const { apps, isAdmin } = this.props;
    const imgPhd = imgPlaceholder(24);
    return (
      <ul className={classNames(styles.appList, { [styles.normalList]: !isAdmin })}>
        {apps.map((data, index) => (
          <li key={data.app_id}>
            {isAdmin && <span className={styles.order}>{index + 1}</span>}
            <TdName
              image={data.icon || imgPhd}
              name={data.name}
              description={data.description}
              linkUrl={`/dashboard/app/${data.app_id}`}
              noCopy={true}
            />
            {isAdmin && (
              <span className={styles.total}>
                <span className={styles.number}>{data.total || 0}</span> Clusters
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  }
}

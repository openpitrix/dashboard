import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import TdName from 'components/TdName/index';
import styles from './index.scss';
import { getFilterObj } from 'utils';

@translate()
export default class AppList extends PureComponent {
  static propTypes = {
    topApps: PropTypes.array,
    apps: PropTypes.array,
    isAdmin: PropTypes.bool
  };

  static defaultProps = {
    topApps: [],
    apps: [],
    isAdmin: false
  };

  render() {
    const { topApps, apps, isAdmin } = this.props;
    const items = isAdmin ? topApps : apps;
    return (
      <ul className={styles.appList}>
        {items.map((item, index) => {
          const app = getFilterObj(apps, 'app_id', item.id);
          return (
            <li key={item.id || item.app_id}>
              {isAdmin && <span className={styles.order}>{index + 1}</span>}
              <TdName
                className="largeShow"
                image={app.icon || item.icon || 'appcenter'}
                imageSize={24}
                name={item.name || app.name}
                description={item.description || app.description}
                linkUrl={isAdmin ? `/app/${item.id}` : `/dashboard/app/${item.app_id}`}
                noCopy={true}
              />
            </li>
          );
        })}
      </ul>
    );
  }
}

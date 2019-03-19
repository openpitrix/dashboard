import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import TdName from 'components/TdName/index';
import { getFilterObj } from 'utils';
import routes, { toRoute } from 'routes';

import styles from './index.scss';

@withTranslation()
export default class AppList extends PureComponent {
  static propTypes = {
    apps: PropTypes.array,
    isAdmin: PropTypes.bool,
    isDev: PropTypes.bool,
    topApps: PropTypes.array
  };

  static defaultProps = {
    topApps: [],
    apps: [],
    isAdmin: false,
    isDev: false
  };

  render() {
    const { topApps, apps, isAdmin } = this.props;
    const items = isAdmin ? topApps : apps;

    return (
      <ul className={styles.appList}>
        {items.map((item, index) => {
          const app = getFilterObj(apps, 'app_id', item.id);
          if (isAdmin) {
            item.app_id = item.id;
          }

          return (
            <li key={item.id || item.app_id}>
              {isAdmin && <span className={styles.order}>{index + 1}</span>}
              <TdName
                className="largeShow"
                image={app.icon || item.icon}
                imageSize={24}
                name={item.name || app.name}
                description={item.description || app.description}
                linkUrl={toRoute(routes.appDetail, { appId: item.app_id })}
                noCopy={true}
              />
            </li>
          );
        })}
      </ul>
    );
  }
}

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { translate } from 'react-i18next';

import TdName from 'components/TdName/index';
import styles from './index.scss';

@translate()
export default class AppList extends PureComponent {
  static propTypes = {
    apps: PropTypes.array,
    isAdmin: PropTypes.bool
  };

  static defaultProps={
    apps: [],
    isAdmin: false
  }

  render() {
    const { apps, isAdmin } = this.props;

    return (
      <ul className={styles.appList}>
        {apps.map((data, index) => (
          <li key={data.app_id}>
            {isAdmin && <span className={styles.order}>{index + 1}</span>}
            <TdName
              image={data.icon || 'appcenter'}
              imageSize={24}
              name={data.name}
              description={data.description}
              linkUrl={isAdmin ? `/dashboard/app/${data.app_id}` : `/app/${data.app_id}`}
              noCopy={true}
            />
          </li>
        ))}
      </ul>
    );
  }
}

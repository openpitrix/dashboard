import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import TdName from 'components/TdName/index';
import { imgPlaceholder } from 'utils';

import styles from './index.scss';

@translate()
export default class AppList extends PureComponent {
  static propTypes = {
    apps: PropTypes.array,
    isAdmin: PropTypes.bool
  };

  render() {
    const { apps, isAdmin, t } = this.props;
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
          </li>
        ))}
      </ul>
    );
  }
}

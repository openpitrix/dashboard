import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Icon, Image } from 'components/Base';

import styles from './index.scss';

export default class AppImages extends Component {
  static propTypes = {
    apps: PropTypes.array
  };
  render() {
    const { apps } = this.props;
    const iconsrc = '/assets/None24.svg';
    return (
      <div className={styles.appImages}>
        <div className={styles.name}>Apps</div>
        <div className={styles.images}>
          {apps &&
            apps.slice(0, 10).map(({ app_id, icon }) => (
              <Link key={app_id} to={`/dashboard/app/${app_id}`}>
                <Image src={icon || iconsrc} />
              </Link>
            ))}
          <span className={styles.totalNum}>{apps ? apps.length : 0}</span>
        </div>
      </div>
    );
  }
}

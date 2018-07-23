import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon, Image } from 'components/Base';

import styles from './index.scss';

export default class AppImages extends Component {
  static propTypes = {
    apps: PropTypes.array
  };
  render() {
    const { apps } = this.props;
    return (
      <div className={styles.appImages}>
        <div className={styles.name}>Apps</div>
        <div className={styles.images}>
          {apps &&
            apps
              .slice(0, 10)
              .map(
                ({ app_id, icon }) =>
                  icon ? (
                    <Image key={app_id} src={icon} />
                  ) : (
                    <Icon key={app_id} size={24} name="appcenter" />
                  )
              )}
          <span className={styles.totalNum}>{apps ? apps.length : 0}</span>
        </div>
      </div>
    );
  }
}

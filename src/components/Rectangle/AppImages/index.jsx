import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { imgPlaceholder } from 'utils';
import styles from './index.scss';

export default class AppImages extends Component {
  static propTypes = {
    apps: PropTypes.array
  };
  render() {
    const { apps } = this.props;
    const imgPhd = imgPlaceholder();
    return (
      <div className={styles.appImages}>
        <div className={styles.name}>Apps</div>
        <div className={styles.images}>
          {apps &&
            apps.slice(0, 10).map(({ app_id, icon }) => <img key={app_id} src={icon || imgPhd} />)}
          <span className={styles.totalNum}>{apps ? apps.length : 0}</span>
        </div>
      </div>
    );
  }
}

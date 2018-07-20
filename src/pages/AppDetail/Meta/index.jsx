import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Base/Icon';
import { get } from 'lodash';

import styles from './index.scss';

const Meta = ({ app }) => {
  let icon;
  if (app.icon) {
    icon = <img src={app.icon} className={styles.icon} />;
  } else {
    icon = <Icon name="appcenter" size="large" className={styles.icon} />;
  }

  return (
    <div className={styles.meta}>
      {icon}
      <div className={styles.title}>
        {app.name}
        <span className={styles.latestVersion}>{get(app, 'latest_app_version.name')}</span>
      </div>
      {/*<div className={styles.carousel}>{app.screenshots}</div>*/}
      <div className={styles.desc}>{app.description}</div>
    </div>
  );
};

Meta.propTypes = {
  app: PropTypes.object
};

Meta.defaultProps = {
  app: {}
};

export default Meta;

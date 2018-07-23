import React from 'react';
import PropTypes from 'prop-types';

import { Image } from 'components/Base';
import { get } from 'lodash';

import styles from './index.scss';

const Meta = ({ app }) => {
  return (
    <div className={styles.meta}>
      <Image src={app.icon} className={styles.icon} size={48} />
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

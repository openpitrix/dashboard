import React from 'react';
import PropTypes from 'prop-types';

import { Image } from 'components/Base';
import { get } from 'lodash';

import styles from './index.scss';

const Meta = ({ app }) => (
  <div className={styles.meta}>
    <span className={styles.icon}>
      <Image src={app.icon} iconSize={48} iconLetter={app.name} />
    </span>
    <div className={styles.title}>
      {app.name}
      <span className={styles.latestVersion}>
        {get(app, 'latest_app_version.name')}
      </span>
    </div>
    <div className={styles.desc}>{app.description}</div>
  </div>
);

Meta.propTypes = {
  app: PropTypes.object
};

Meta.defaultProps = {
  app: {}
};

export default Meta;

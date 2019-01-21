import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { getVersionTypesName } from 'config/version-types';

import styles from './index.scss';

const VersionType = ({ className, types }) => (
  <div className={classnames(styles.versionType, className)}>
    {(getVersionTypesName(types) || []).join(' ')}
  </div>
);

VersionType.propTypes = {
  className: PropTypes.string,
  types: PropTypes.string
};

export default VersionType;

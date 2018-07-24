import React from 'react';
import PropTypes from 'prop-types';

import { isArray, isObject } from 'utils/types';

import styles from './index.scss';

const VersionItem = ({ title = '', value = '', type = '' }) => {
  const resolveValue = value => {
    if (!value) return 'None';
    if (type === 'link') {
      return (
        <a href={value} target="_blank">
          {value}
        </a>
      );
    }
    if (type === 'maintainer') {
      try {
        value = JSON.parse(value);
      } catch (e) {}

      value = value || [];
      if (isObject(value)) {
        value = [value];
      }
      if (isArray(value)) {
        return value.map((v, i) => (
          <div key={i}>
            <a href={`mailto:${v.email || ''}`}>{v.name || ''}</a>
          </div>
        ));
      }
    }
    return value.toString();
  };

  return (
    <div className={styles.versionItem}>
      <div className={styles.title}>{title}</div>
      <div className={styles.value}>{resolveValue(value)}</div>
    </div>
  );
};

VersionItem.propTypes = {
  title: PropTypes.string,
  value: PropTypes.node,
  type: PropTypes.string
};

export default VersionItem;

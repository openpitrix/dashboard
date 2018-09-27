import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import { capitalize, noop } from 'lodash';

import { mappingStatus } from 'utils';

import styles from './index.scss';

const versionStatus = [
  'draft', // to be submitted
  'submitted', // in review
  'passed', // approved
  'active', // published

  'deleted',
  'suspended',
  'rejected'
];

@translate()
export default class VersionList extends React.Component {
  static propTypes = {
    versions: PropTypes.array.isRequired,
    currentVersion: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    children: PropTypes.node
  };

  static defaultProps = {
    versions: [],
    currentVersion: {},
    onSelect: noop
  };

  normalizeStatusToClassName = (status = '') => {
    status = status.toLowerCase();
    if (versionStatus.includes(status)) {
      return styles[status];
    }
    return styles.draft; // default app version status
  };

  render() {
    const { versions, currentVersion, onSelect, children, t } = this.props;

    return (
      <div className={styles.versionList}>
        <div className={styles.title}>{t('Versions')}</div>
        <ul>
          {versions.map((version, idx) => (
            <li
              key={version.version_id || idx}
              className={classnames(styles.item, this.normalizeStatusToClassName(version.status), {
                [styles.selected]: version.version_id === currentVersion.version_id
              })}
              onClick={() => onSelect(version)}
            >
              <span className={styles.dot} />
              <span className={styles.txt}>{version.name}</span>
              <span className={styles.status}>{t(mappingStatus(capitalize(version.status)))}</span>
            </li>
          ))}
        </ul>
        {children}
      </div>
    );
  }
}

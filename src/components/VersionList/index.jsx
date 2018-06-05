import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Base/Icon';
import styles from './index.scss';

export default class VersionList extends PureComponent {
  static propTypes = {
    versions: PropTypes.array,
    deleteVersion: PropTypes.func
  };

  deleteVersion = id => {
    this.props.deleteVersion(id);
  };

  render() {
    const { versions } = this.props;
    return (
      <ul className={styles.versionList}>
        {versions.map(data => (
          <li key={data.version_id}>
            <div className={styles.column}>
              <div className={styles.version}>{data.name}</div>
              <div className={styles.word}>{data.description}</div>
            </div>
            <div className={styles.column}>
              <div className={styles.number}>{data.sequence || 0}</div>
              <div className={styles.word}>Cluster Count</div>
            </div>
            <div className={styles.column}>
              <a href={data.package_name} traget="_blank">
                <i className="fa fa-download" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

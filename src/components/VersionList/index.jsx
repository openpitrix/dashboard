import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isObject } from 'utils/types';

import styles from './index.scss';

export default class VersionList extends PureComponent {
  static propTypes = {
    versions: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    deleteVersion: PropTypes.func
  };

  static defaultProps = {
    deleteVersion: () => {}
  };

  deleteVersion = id => {
    this.props.deleteVersion(id);
  };

  render() {
    let { versions } = this.props;

    if (isObject(versions)) {
      versions = versions.toJSON();
    }

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
              <a href={data.package_name} target="_blank">
                <i className="fa fa-download" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

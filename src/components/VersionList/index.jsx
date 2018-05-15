import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Icon from 'components/Base/Icon';
import styles from './index.scss';

export default class VersionList extends PureComponent {
  static propTypes = {
    versions: PropTypes.array
  };

  render() {
    const { versions } = this.props;
    return (
      <div className={styles.versionList}>
        <div className={styles.title}>
          Versions
          <div className={styles.all}>All Versions →</div>
        </div>
        <ul className={styles.list}>
          {versions.map(data => (
            <li key={data.version_id}>
              <div className={styles.column}>
                <div className={styles.version}>{data.name}</div>
                <div className={styles.word}>{data.description}</div>
              </div>
              <div className={styles.column}>
                <div className={styles.number}>{data.sequence}</div>
                <div className={styles.word}>Cluster Count</div>
              </div>
              <div className={classnames(styles.column, styles.download)}>
                <Icon name="refresh" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

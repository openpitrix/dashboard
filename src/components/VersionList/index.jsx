import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Icon from 'components/Base/Icon';
import styles from './index.scss';

export default class VersionList extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    name: PropTypes.string,
    desc: PropTypes.string,
    fold: PropTypes.bool
  };

  render() {
    return (
      <div className={styles.versionList}>
        <div className={styles.title}>
          Versions
          <div className={styles.all}>All Versions →</div>
        </div>
        <ul className={styles.list}>
          <li>
            <div className={styles.column}>
              <div className={styles.version}>4.1</div>
              <div className={styles.word}>d549a285</div>
            </div>
            <div className={styles.column}>
              <div className={styles.number}>4</div>
              <div className={styles.word}>Cluster Count</div>
            </div>
            <div className={classnames(styles.column, styles.download)}>
              <Icon name="refresh" />
            </div>
          </li>
          <li>
            <div className={styles.column}>
              <div className={styles.version}>4.1</div>
              <div className={styles.word}>d549a285</div>
            </div>
            <div className={styles.column}>
              <div className={styles.number}>4</div>
              <div className={styles.word}>d549a285</div>
            </div>
            <div className={styles.column}>
              <Icon name="refresh" />
            </div>
          </li>
          <li>
            <div className={styles.column}>
              <div className={styles.version}>4.1</div>
              <div className={styles.word}>d549a285</div>
            </div>
            <div className={styles.column}>
              <div className={styles.number}>4</div>
              <div className={styles.word}>d549a285</div>
            </div>
            <div className={styles.column}>
              <Icon name="refresh" />
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

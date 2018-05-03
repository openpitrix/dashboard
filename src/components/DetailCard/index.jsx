import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Status from 'components/Status';
import styles from './index.scss';

export default class DetailCard extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    name: PropTypes.string,
    desc: PropTypes.string,
    fold: PropTypes.bool
  };

  render() {
    const { icon } = this.props;
    return (
      <div className={styles.detailCard}>
        <img src={icon || 'http://via.placeholder.com/24x24'} className={styles.icon} alt="Icon" />
        <div className={styles.title}>
          <div className={styles.name}>JawsDB Maria</div>
          <div className={styles.id}>id:d549a285-3859-4824-beb9-d80e6a</div>
          <div className={styles.preview}>Preview in Catalog →</div>
        </div>
        <ul className={styles.detail}>
          <li>
            <span className={styles.name}>Status</span>
            <Status name="Active" type="active" />
          </li>
          <li>
            <span className={styles.name}>Repo</span>Private Zone Staging
          </li>
          <li>
            <span className={styles.name}>Latest Version</span>1.2.2
          </li>
          <li>
            <span className={styles.name}>Category</span>Devops
          </li>
          <li>
            <span className={styles.name}>Developer</span>Samantha
          </li>
          <li>
            <span className={styles.name}>Developer</span>2018/01/09
          </li>
        </ul>
      </div>
    );
  }
}

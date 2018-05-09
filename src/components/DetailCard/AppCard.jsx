import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Status from 'components/Status';
import styles from './index.scss';

export default class AppCard extends PureComponent {
  static propTypes = {
    appDetail: PropTypes.object
  };

  render() {
    const { appDetail } = this.props;
    return (
      <div className={styles.detailCard}>
        <img
          src={appDetail.icon || 'http://via.placeholder.com/24x24'}
          className={styles.icon}
          alt="Icon"
        />
        <div className={styles.title}>
          <div className={styles.name}>{appDetail.name}</div>
          <div className={styles.id}>id:{appDetail.app_id}</div>
          <div className={styles.preview}>
            <Link to="/manage/categories">Preview in Catalog →</Link>
          </div>
        </div>
        <ul className={styles.detail}>
          <li>
            <span className={styles.name}>Status</span>
            <Status name={appDetail.status} type={appDetail.status} />
          </li>
          <li>
            <span className={styles.name}>Repo</span>
            {appDetail.repo_id}
          </li>
          <li>
            <span className={styles.name}>Latest Version</span>
            {appDetail.version}
          </li>
          <li>
            <span className={styles.name}>Category</span>
            {appDetail.category}
          </li>
          <li>
            <span className={styles.name}>Developer</span>
            {appDetail.owner}
          </li>
          <li>
            <span className={styles.name}>Date Updated</span>
            {appDetail.update_time}
          </li>
        </ul>
      </div>
    );
  }
}

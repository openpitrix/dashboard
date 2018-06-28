import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { get } from 'lodash';

import Status from 'components/Status';
import { getParseDate, imgPlaceholder } from 'utils';
import styles from './index.scss';

export default class AppCard extends PureComponent {
  static propTypes = {
    appDetail: PropTypes.object.isRequired
  };

  render() {
    const { appDetail } = this.props;
    const imgPhd = imgPlaceholder(24);
    return (
      <div className={styles.detailCard}>
        <img src={appDetail.icon || imgPhd} className={styles.icon} alt="Icon" />
        <div className={styles.title}>
          <div className={styles.name}>{appDetail.name}</div>
          <div className={styles.id}>id:{appDetail.app_id}</div>
          <div className={styles.preview}>
            <Link to="/dashboard/categories">Preview in Catalog →</Link>
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
            {get(appDetail, 'latest_app_version.name', '')}
          </li>
          <li>
            <span className={styles.name}>Category</span>
            {get(appDetail, 'category_set', [])
              .map(cate => cate.name)
              .join(', ')}
          </li>
          <li>
            <span className={styles.name}>Developer</span>
            {appDetail.owner}
          </li>
          <li>
            <span className={styles.name}>Date Updated</span>
            {getParseDate(appDetail.status_time)}
          </li>
        </ul>
      </div>
    );
  }
}

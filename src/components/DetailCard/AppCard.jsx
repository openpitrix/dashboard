import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import Status from 'components/Status';
import TimeShow from 'components/TimeShow';
import CopyId from './CopyId';
import { imgPlaceholder } from 'utils';
import styles from './index.scss';

export default class AppCard extends PureComponent {
  static propTypes = {
    appDetail: PropTypes.object.isRequired,
    repoName: PropTypes.string
  };

  render() {
    const { appDetail, repoName } = this.props;
    const imgPhd = imgPlaceholder(24);
    return (
      <div className={styles.detailCard}>
        <img src={appDetail.icon || imgPhd} className={styles.icon} alt="Icon" />
        <div className={styles.title}>
          <div className={styles.name}>{appDetail.name}</div>
          <CopyId id={appDetail.app_id} />
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
            <Link to={`/dashboard/repo/${appDetail.repo_id}`}>{repoName}</Link>
          </li>
          <li>
            <span className={styles.name}>Latest Version</span>
            {get(appDetail, 'latest_app_version.name', '')}
          </li>
          <li>
            <span className={styles.name}>Category</span>
            {get(appDetail, 'category_set', [])
              .filter(cate => cate.category_id)
              .map(cate => cate.name)
              .join(', ')}
          </li>
          <li>
            <span className={styles.name}>Developer</span>
            {appDetail.owner}
          </li>
          <li>
            <span className={styles.name}>Date Updated</span>
            <TimeShow time={appDetail.status_time} type="detailTime" />
          </li>
        </ul>
      </div>
    );
  }
}

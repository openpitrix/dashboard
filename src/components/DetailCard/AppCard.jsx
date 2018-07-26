import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { ProviderName } from 'components/TdName';
import { Image } from 'components/Base';
import Status from 'components/Status';
import TimeShow from 'components/TimeShow';
import CopyId from './CopyId';

import styles from './index.scss';

export default class AppCard extends PureComponent {
  static propTypes = {
    appDetail: PropTypes.object.isRequired,
    repoName: PropTypes.string,
    repoProvider: PropTypes.string
  };

  render() {
    const { appDetail, repoName, repoProvider } = this.props;

    return (
      <div className={styles.detailCard}>
        <span className={styles.icon}>
          <Image src={appDetail.icon} size={24} alt="Icon" className={styles.icon} />
        </span>
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
            <Link to={`/dashboard/repo/${appDetail.repo_id}`}>
              <ProviderName provider={repoProvider} name={repoName} className={styles.repoName} />
            </Link>
          </li>
          <li>
            <span className={styles.name}>Latest Version</span>
            {get(appDetail, 'latest_app_version.name', '')}
          </li>
          <li>
            <span className={styles.name}>Category</span>
            {get(appDetail, 'category_set', [])
              .filter(cate => cate.category_id && cate.status === 'enabled')
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

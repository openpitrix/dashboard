import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { get } from 'lodash';

import { ProviderName } from 'components/TdName';
import { Image } from 'components/Base';
import Status from 'components/Status';
import TimeShow from 'components/TimeShow';
import CopyId from './CopyId';

import styles from './index.scss';

@translate()
export default class AppCard extends React.Component {
  static propTypes = {
    appDetail: PropTypes.object.isRequired,
    repoName: PropTypes.string,
    repoProvider: PropTypes.string,
    userName: PropTypes.string
  };

  /* shouldComponentUpdate(nextProps) {
    const { appDetail} = nextProps;
    return appDetail.app_id !== this.props.appDetail.app_id;
  } */

  render() {
    const {
      appDetail, repoName, repoProvider, userName, t
    } = this.props;

    return (
      <div className={styles.detailCard}>
        <span className={styles.icon}>
          <Image src={appDetail.icon} alt="Icon" />
        </span>
        <div className={styles.title}>
          <div className={styles.name} title={appDetail.name}>
            {appDetail.name}
          </div>
          <CopyId id={appDetail.app_id} />
          <div className={styles.preview}>
            <Link to={`/app/${appDetail.app_id}`}>
              {t('Preview in Catalog')} →
            </Link>
          </div>
        </div>
        <ul className={styles.detail}>
          <li>
            <span className={styles.name}>{t('Status')}</span>
            <Status name={appDetail.status} type={appDetail.status} />
          </li>
          <li>
            <span className={styles.name}>{t('Repo')}</span>
            <Link to={`/dashboard/repo/${appDetail.repo_id}`}>
              <ProviderName provider={repoProvider} name={repoName} />
            </Link>
          </li>
          <li>
            <span className={styles.name}>{t('Latest Version')}</span>
            {get(appDetail, 'latest_app_version.name', '')}
          </li>
          <li>
            <span className={styles.name}>{t('Category')}</span>
            {get(appDetail, 'category_set', [])
              .filter(cate => cate.category_id && cate.status === 'enabled')
              .map(cate => cate.name)
              .join(', ')}
          </li>
          <li>
            <span className={styles.name}>{t('Developer')}</span>
            {userName}
          </li>
          <li>
            <span className={styles.name}>{t('Date Updated')}</span>
            <TimeShow time={appDetail.status_time} type="detailTime" />
          </li>
        </ul>
      </div>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import { Image } from 'components/Base';
import Status from 'components/Status';
import { ProviderName } from 'components/TdName';
import TimeShow from 'components/TimeShow';
import VersionType from 'components/VersionType';
import TdUser from 'components/TdUser';
import routes, { toRoute } from 'routes';
import CopyId from './CopyId';

import styles from './index.scss';

@withTranslation()
export default class ClusterCard extends Component {
  static propTypes = {
    app: PropTypes.object,
    detail: PropTypes.object.isRequired,
    provider: PropTypes.string,
    runtimeName: PropTypes.string,
    users: PropTypes.arry,
    version: PropTypes.object
  };

  static defaultProps = {
    detail: {},
    app: {},
    version: {},
    provider: '',
    runtimeName: '',
    users: []
  };

  render() {
    const {
      detail,
      app,
      version,
      runtimeName,
      provider,
      users,
      t
    } = this.props;

    return (
      <div className={styles.detailCard}>
        <div className={classnames(styles.title, styles.noImg)}>
          <div className={styles.name}>{detail.name || t('None')}</div>
          <CopyId id={detail.cluster_id} />
        </div>
        <ul className={styles.detail}>
          <li>
            <span className={styles.name}>{t('Status')}</span>
            <Status
              type={detail.status}
              transition={detail.transition_status}
            />
          </li>
          <li>
            <span className={styles.name}>{t('App')}</span>
            <label className={styles.appName}>
              <label className={styles.appImage}>
                <Image src={app.icon} iconLetter={app.name} />
              </label>
              <Link
                to={toRoute(routes.appDetail, { appId: app.app_id })}
                className={styles.appName}
              >
                {app.name}
              </Link>
            </label>
          </li>
          <li>
            <span className={styles.name}>{t('Version')}</span>
            <label className={styles.value}>
              <VersionType types={version.type} />
              <span className={styles.versionName}>{version.name}</span>
            </label>
          </li>
          <li className={styles.setHeight}>
            <span className={styles.name}>{t('Runtime')}</span>
            <ProviderName
              provider={provider}
              name={runtimeName}
              className={styles.value}
            />
          </li>
          <li>
            <span className={styles.name}>{t('Creator')}</span>
            <TdUser
              className={styles.value}
              userId={detail.owner}
              users={users}
            />
          </li>
          <li>
            <span className={styles.name}>{t('Create Time')}</span>
            <TimeShow time={detail.create_time} type="detailTime" />
          </li>
          <li>
            <span className={styles.name}>{t('Date Updated')}</span>
            <TimeShow time={detail.upgrade_time} type="detailTime" />
          </li>
        </ul>
      </div>
    );
  }
}

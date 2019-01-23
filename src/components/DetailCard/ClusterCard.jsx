import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import Status from 'components/Status';
import { ProviderName } from 'components/TdName';
import TimeShow from 'components/TimeShow';
import routes, { toRoute } from 'routes';
import CopyId from './CopyId';

import styles from './index.scss';

@translate()
export default class ClusterCard extends Component {
  static propTypes = {
    appName: PropTypes.string,
    detail: PropTypes.object.isRequired,
    provider: PropTypes.string,
    runtimeName: PropTypes.string,
    userName: PropTypes.string
  };

  static defaultProps = {
    detail: {}
  };

  render() {
    const {
      detail, appName, runtimeName, provider, userName, t
    } = this.props;

    return (
      <div className={styles.detailCard}>
        <div className={classnames(styles.title, styles.noImg)}>
          <div className={styles.name}>{detail.name || t('None')}</div>
          <CopyId id={detail.cluster_id} />
        </div>
        <ul className={styles.detail}>
          {detail.frontgate_id && (
            <li>
              <span className={styles.name}>{t('Frontgate ID')}</span>
              <span className={styles.id}>{detail.frontgate_id}</span>
            </li>
          )}
          <li>
            <span className={styles.name}>{t('Status')}</span>
            <Status
              type={detail.status}
              transition={detail.transition_status}
            />
          </li>
          <li>
            <span className={styles.name}>{t('App')}</span>
            <Link
              to={toRoute(routes.portal.appDetail, { appId: detail.app_id })}
            >
              {appName || t('None')}
            </Link>
          </li>
          <li>
            <span className={styles.name}>{t('Version')}</span>
            {detail.version}
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
            {userName}
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

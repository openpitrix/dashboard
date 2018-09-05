import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import Status from '../Status';
import TagShow from '../TagShow';
import TimeShow from 'components/TimeShow';

import { ProviderName } from 'components/TdName';
import CopyId from './CopyId';
import styles from './index.scss';

@translate()
export default class RuntimeCard extends Component {
  static propTypes = {
    detail: PropTypes.object.isRequired,
    appCount: PropTypes.number,
    clusterCount: PropTypes.number
  };

  render() {
    const { detail, appCount, clusterCount, t } = this.props;

    return (
      <div className={styles.detailCard}>
        <div className={classnames(styles.title, styles.noImg)}>
          <div className={styles.name}>{detail.name}</div>
          <CopyId id={detail.runtime_id || detail.repo_id} />
          <div className={styles.description}>{detail.description}</div>
        </div>
        <ul className={styles.detail}>
          <li>
            <span className={styles.name}>{t('Status')}</span>
            <Status type={detail.status} transition={detail.transition} />
          </li>
          <li>
            <span className={styles.name}>{t('Runtime Provider')}</span>
            {detail.repo_id && (
              <div className={styles.labels}>
                {detail.providers.map(data => (
                  <ProviderName key={data} provider={data} name={data} />
                ))}
              </div>
            )}
            {detail.runtime_id && (
              <ProviderName provider={detail.provider} name={detail.provider} />
            )}
          </li>
          {detail.repo_id && (
            <li>
              <span className={styles.name}>{t('Visibility')}</span>
              {detail.visibility}
            </li>
          )}
          {detail.runtime_id && (
            <li>
              <span className={styles.name}>{t('Zone/Namespace')}</span>
              {detail.zone}
            </li>
          )}
          <li>
            <span className={styles.name}>{t('Creator')}</span>
            {detail.owner}
          </li>
          <li>
            <span className={styles.name}>
              {detail.repo_id ? t('App') : t('Cluster')}
              {t('Count')}
            </span>
            {detail.repo_id && appCount}
            {detail.runtime_id && clusterCount}
          </li>
          <li>
            <span className={styles.name}>{t('Labels')}</span>
            <div className={styles.labels}>
              {detail.labels && <TagShow tags={detail.labels.slice()} tagStyle="purple" />}
            </div>
          </li>
          <li>
            <span className={styles.name}>{t('Date Updated')}</span>
            <TimeShow time={detail.status_time} type="detailTime" />
          </li>
        </ul>
      </div>
    );
  }
}

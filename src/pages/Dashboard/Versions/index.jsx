import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { versionTypes } from 'config/version-types';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import { Icon, Button } from 'components/Base';
import Layout from 'components/Layout';
import Status from 'components/Status';
import { formatTime, mappingStatus } from 'utils';
import routes, { toRoute } from 'routes';

import styles from './index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore
}))
@observer
export default class Versions extends Component {
  async componentDidMount() {
    await this.props.appVersionStore.fetchTypeVersions(this.appId);
  }

  async componentDidUpdate(prevProps) {
    const { appVersionStore } = this.props;
    const prevAppId = _.get(prevProps.match, 'params.appId', '');

    if (this.appId !== prevAppId) {
      await appVersionStore.fetchTypeVersions(this.appId);
    }
  }

  componentWillUnmount() {
    const { appVersionStore } = this.props;

    appVersionStore.reset();
  }

  get appId() {
    const { match } = this.props;
    return _.get(match, 'params.appId', '');
  }

  toggleHistoryVersions(typeVersion) {
    typeVersion.isShow = !typeVersion.isShow;
  }

  renderTypes(types) {
    const { appStore, t } = this.props;
    const { appDetail } = appStore;
    // get not added types
    const notAddedTypes = versionTypes.filter(
      item => !types.includes(item.value)
    );
    const createUrl = toRoute(routes.portal._dev.versionCreate, {
      appId: appDetail.app_id
    });

    return (
      <div>
        {notAddedTypes.map(item => (
          <div
            key={item.value}
            className={classnames(styles.notAddedType, {
              [styles.disableType]: item.disable
            })}
          >
            <Icon
              name={item.icon}
              size={48}
              className={styles.icon}
              type="dark"
            />
            <div className={styles.name}>{t(item.name)}</div>
            <div className={styles.description}>{t(item.intro)}</div>
            <Link to={`${createUrl}?type=${item.value}&appId=${this.appId}`}>
              <Button className={styles.button} type="primary">
                <Icon name="add" type="white" className={styles.addIcon} />
                {t('New version')}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    );
  }

  renderHistoryVersions(typeVersion) {
    const { appStore, t } = this.props;
    const { appDetail } = appStore;
    const versions = typeVersion.versions || [];
    const historyVersions = versions.filter(
      item => item.status === 'suspended'
    );

    if (historyVersions.length === 0) {
      return <div className={styles.total}>{t('No history version')}</div>;
    }

    return (
      <Fragment>
        <div className={styles.total}>
          {t('HISTORICAL_VERSIONS_TOTAL', { length: historyVersions.length })}
          <span
            onClick={() => this.toggleHistoryVersions(typeVersion)}
            className={styles.toggleIcon}
          >
            {t(typeVersion.isShow ? 'Collapse' : 'Expand')}
            <Icon
              name={typeVersion.isShow ? 'minus-square' : 'plus-square'}
              size={16}
              className={styles.icon}
            />
          </span>
        </div>
        {typeVersion.isShow && (
          <ul className={styles.historyVersion}>
            {historyVersions.map(item => (
              <li key={item.version_id}>
                <Link
                  to={toRoute(routes.portal._dev.versionDetail, {
                    appId: appDetail.app_id,
                    versionId: item.version_id
                  })}
                >
                  <Status
                    type={item.status}
                    name={item.name}
                    className={styles.status}
                  />
                  <label className={styles.description}>
                    {item.description || t('None')}
                  </label>
                  <label className={styles.time}>
                    {t('Suspended time')}:&nbsp;
                    {formatTime(item.update_time, 'YYYY/MM/DD HH:mm:ss')}
                  </label>
                  <label className={styles.link}>{t('View detail')}→</label>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Fragment>
    );
  }

  renderActiveVersions(typeVersion) {
    const { appStore, t } = this.props;
    const { appDetail } = appStore;
    const versions = typeVersion.versions || [];
    const activeVersions = versions.filter(
      item => item.status !== 'suspended' && item.status !== 'deleted'
    );

    return (
      <Fragment>
        <div className={styles.total}>
          {t('ACTIVE_VERSIONS_TOTAL', { length: activeVersions.length })}
        </div>
        <div className={styles.activeVersion}>
          {activeVersions.map(item => (
            <Link
              key={item.version_id}
              className={classnames(styles.version, [styles[item.status]])}
              to={toRoute(routes.portal._dev.versionDetail, {
                appId: appDetail.app_id,
                versionId: item.version_id
              })}
            >
              <Status
                type={mappingStatus(item.status)}
                name={item.name}
                className={styles.status}
              />
              {t(_.capitalize(mappingStatus(item.status)))}
            </Link>
          ))}
        </div>
        {this.renderHistoryVersions(typeVersion)}
      </Fragment>
    );
  }

  render() {
    const {
      appVersionStore, appStore, match, t
    } = this.props;
    const { typeVersions, isLoading } = appVersionStore;
    const { appDetail } = appStore;
    const types = typeVersions.map(item => item.type);

    const createUrl = toRoute(routes.portal._dev.versionCreate, {
      appId: appDetail.app_id
    });

    // this judge for app detail page online versions tab show
    if (!match) {
      return (
        <div className={classnames(styles.versions, styles.showVersions)}>
          {typeVersions.map(item => (
            <div key={item.type} className={styles.addedVersion}>
              <div className={styles.title}>
                {(_.find(versionTypes, { value: item.type }) || {}).name}
              </div>
              {this.renderActiveVersions(item)}
            </div>
          ))}
        </div>
      );
    }

    return (
      <Layout
        isLoading={isLoading}
        className={styles.versions}
        pageTitle={t('Version manage')}
        isCenterPage
      >
        <div className={styles.noteWords}>
          {t('APP_DELIVERY_MODES_EXPLAIN')}
        </div>

        <div className={styles.typeTitle}>{t('Added')}</div>
        {typeVersions.map(item => (
          <div key={item.type} className={styles.addedVersion}>
            <div className={styles.title}>
              {(_.find(versionTypes, { value: item.type }) || {}).name}
              <Link to={`${createUrl}?type=${item.type}&appId=${this.appId}`}>
                <Button className={styles.button} type="default">
                  <Icon name="add" type="dark" />
                  {t('New version')}
                </Button>
              </Link>
            </div>
            {this.renderActiveVersions(item)}
          </div>
        ))}

        {types.length < 6 && (
          <Fragment>
            <div className={styles.typeTitle}>{t('Not added')}</div>
            {this.renderTypes(types)}
          </Fragment>
        )}
      </Layout>
    );
  }
}

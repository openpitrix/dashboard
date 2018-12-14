import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import _, { capitalize } from 'lodash';

import { Icon, Button } from 'components/Base';
import Layout from 'components/Layout';
import Status from 'components/Status';

import versionTypes from 'config/version-types';
import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore
}))
@observer
export default class Versions extends Component {
  async componentDidMount() {
    const { appVersionStore, appStore, match } = this.props;
    const { appId } = match.params;

    await appStore.fetch(appId);
    await appVersionStore.fetchTypeVersions(appId);
  }

  componentWillUnmount() {
    const { appVersionStore } = this.props;
    appVersionStore.reset();
  }

  toggleHistoryVersions(typeVersion) {
    typeVersion.isShow = !typeVersion.isShow;
  }

  renderTypes(types) {
    const { match, t } = this.props;
    const { appId } = match.params;
    // get not added types
    const notAddedTypes = versionTypes.filter(
      item => !types.includes(item.value)
    );

    return (
      <div>
        {notAddedTypes.map(item => (
          <div key={item.value} className={styles.notAddedType}>
            <Icon
              name={item.icon}
              size={48}
              className={styles.icon}
              type="dark"
            />
            <div className={styles.name}>{t(item.name)}</div>
            <div className={styles.description}>{t(item.intro)}</div>
            <Link
              to={`/dashboard/app/${appId}/create-version?type=${item.value}`}
            >
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
    const { match, t } = this.props;
    const { appId } = match.params;
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
                <Link to={`/dashboard/app/${appId}/version/${item.version_id}`}>
                  <Status
                    type={item.status}
                    name={item.name}
                    className={styles.status}
                  />
                  <label className={styles.description}>
                    {item.description}
                  </label>
                  <label className={styles.time}>
                    {t('Suspended time')}: {item.update_time}
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
    const { match, t } = this.props;
    const { appId } = match.params;
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
              to={`/dashboard/app/${appId}/version/${item.version_id}`}
            >
              <Status
                type={item.status}
                name={item.name}
                className={styles.status}
              />
              {t(_.capitalize(item.status))}
            </Link>
          ))}
        </div>
        {this.renderHistoryVersions(typeVersion)}
      </Fragment>
    );
  }

  render() {
    const { appVersionStore, match, t } = this.props;
    const { typeVersions } = appVersionStore;
    const { appId } = match.params;
    const types = typeVersions.map(item => item.type);

    return (
      <Layout
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
              <Link
                to={`/dashboard/app/${appId}/create-version?type=${item.type}`}
              >
                <Button className={styles.button} type="default">
                  <Icon name="add" type="dark" className={styles.addIcon} />
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

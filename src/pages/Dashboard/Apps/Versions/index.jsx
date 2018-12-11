import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

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
    const { appVersionStore, match } = this.props;
    const { appId } = match.params;

    await appVersionStore.fetchAppVersions(appId);
  }

  componentWillUnmount() {
    const { appVersionStore } = this.props;
    appVersionStore.reset();
  }

  toggleHistoryVersions(typeVersion) {
    typeVersion.isShow = !typeVersion.isShow;
  }

  renderTypes(types) {
    const { t } = this.props;
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
            <Button className={styles.button} type="primary">
              <Icon name="add" type="white" className={styles.addIcon} />
              {t('New version')}
            </Button>
          </div>
        ))}
      </div>
    );
  }

  renderHistoryVersions(typeVersion) {
    const { t } = this.props;
    const versions = typeVersion.versions;
    const historyVersions = versions.filter(
      item => item.status === 'suspended'
    );

    if (historyVersions.length === 0) {
      return <div className={styles.total}>没有历史版本</div>;
    }

    return (
      <Fragment>
        <div className={styles.total}>
          以及 {historyVersions.length} 个历史版本
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
                <Link to={`/dashboard/version/${item.version_id}`}>
                  <Status
                    type={item.status}
                    name={item.name}
                    className={styles.status}
                  />
                  <label className={styles.description}>
                    {item.description}
                  </label>
                  <label className={styles.time}>
                    {t('下架时间')}: {item.update_time}
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
    const { t } = this.props;
    const versions = typeVersion.versions;
    const activeVersions = versions.filter(item => item.status !== 'suspended');

    return (
      <Fragment>
        <div className={styles.total}>
          当前有 {activeVersions.length} 个活跃版本
        </div>
        <div className={styles.activeVersion}>
          {activeVersions.map(item => (
            <Link
              key={item.version_id}
              className={classnames(styles.version, [styles[item.status]])}
              to={`/dashboard/version/${item.version_id}`}
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
    const { appVersionStore, t } = this.props;
    const { versions } = appVersionStore;
    const types = versions.map(item => item.type);

    return (
      <Layout className={styles.versions} pageTitle="版本管理" isCenterPage>
        <div className={styles.noteWords}>
          每个应用可支持多种交付方式，每种交付方式的版本是相互独立的。
        </div>

        <div className={styles.typeTitle}>{t('已添加')}</div>
        {versions.map(item => (
          <div key={item.type} className={styles.addedVersion}>
            <div className={styles.title}>
              {(_.find(versionTypes, { value: item.type }) || {}).name}
              <Button className={styles.button} type="default">
                <Icon name="add" type="dark" className={styles.addIcon} />
                {t('New version')}
              </Button>
            </div>
            {this.renderActiveVersions(item)}
          </div>
        ))}

        {types.length < 6 && (
          <Fragment>
            <div className={styles.typeTitle}>{t('未添加')}</div>
            {this.renderTypes(types)}
          </Fragment>
        )}
      </Layout>
    );
  }
}

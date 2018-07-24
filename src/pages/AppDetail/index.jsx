import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { translate } from 'react-i18next';
import { formatTime } from 'utils';

import Layout, { Grid, Section, BackBtn, Panel } from 'components/Layout';
import Button from 'components/Base/Button';
import Meta from './Meta';
import Information from './Information';
import { QingCloud, Helm } from './Body';

import styles from './index.scss';

const VersionItem = ({ title = '', value = '', type = '' }) => (
  <div className={styles.versionItem}>
    <div className={styles.title}>{title}</div>
    <div className={styles.value}>
      {type === 'link' ? (
        <a target="_blank" href={value}>
          {value}
        </a>
      ) : (
        type === 'array' && value.map((data, index) => <div key={index}>{data}</div>)
      )}
    </div>
  </div>
);

VersionItem.propTypes = {
  title: PropTypes.string,
  value: PropTypes.node,
  type: PropTypes.string
};

@translate()
@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  appVersionStore: rootStore.appVersionStore,
  repoStore: rootStore.repoStore
}))
@observer
export default class AppDetail extends Component {
  static async onEnter({ appStore, appVersionStore, repoStore }, { appId }) {
    appStore.currentPic = 1;
    await appStore.fetch(appId);
    await appVersionStore.fetchAll({ app_id: appId });
    if (appStore.appDetail.repo_id) {
      repoStore.fetchRepoDetail(appStore.appDetail.repo_id);
    }
    if (appStore.appDetail.latest_app_version) {
      appVersionStore.fetchPackageFiles(appStore.appDetail.latest_app_version.version_id);
    }
  }

  changePicture = (type, number, pictures) => {
    const { appStore } = this.props;
    let { currentPic } = appStore;
    if (type === 'dot') {
      currentPic = number;
    }
    if (type === 'pre' && currentPic > 2) {
      currentPic -= 2;
    }
    if (type === 'next' && currentPic + 2 < pictures.length) {
      currentPic += 2;
    }
    appStore.currentPic = currentPic;
    return currentPic;
  };

  renderBody() {
    const { appStore } = this.props;

    return (
      <QingCloud
        app={appStore.appDetail}
        currentPic={appStore.currentPic}
        changePicture={this.changePicture}
        pictures={appStore.appDetail.screenshots}
      />
    );
  }

  render() {
    const { appStore, repoStore, appVersionStore } = this.props;
    const { isLoading } = appStore;
    const appDetail = appStore.appDetail;
    const repoProvider = get(repoStore.repoDetail, 'providers[0]', '');
    const isScreenshots = repoProvider !== 'kubernetes';
    return (
      <Layout
        noTabs
        noNotification
        isLoading={isLoading}
        backBtn={<BackBtn label="catalog" link="/" />}
      >
        <Grid>
          <Section size={8}>
            <Panel className={styles.introCard}>
              <Meta app={appDetail} />
              {!isScreenshots && <Helm readme={appVersionStore.readme} />}
              {isScreenshots && (
                <Fragment>
                  {appDetail.screenshots && this.renderBody()}
                  <Information app={appDetail} repo={repoStore.repoDetail} />
                </Fragment>
              )}
            </Panel>
          </Section>
          {this.renderVersions()}
        </Grid>
      </Layout>
    );
  }

  renderVersions() {
    const { appStore, appVersionStore, t } = this.props;
    const appDetail = appStore.appDetail;
    const appVersions = appVersionStore.versions.toJSON();
    let maintainers = [];
    console.log(get(appDetail, 'maintainers'));
    if (get(appDetail, 'maintainers')) {
      const objs = JSON.parse(get(appDetail, 'maintainers'));
      objs.map(obj => {
        maintainers.push(obj.name);
        maintainers.push(obj.email);
      });
    }

    return (
      <Section>
        <Panel className={styles.detailCard}>
          <Link to={`/dashboard/app/${appDetail.app_id}/deploy`}>
            <Button
              className={styles.deployBtn}
              type="primary"
              disabled={appDetail.status === 'deleted'}
            >
              {t('Deploy')}
            </Button>
          </Link>
          <div className={styles.versions}>
            <p>{t('Chart Versions')}</p>
            <ul>
              {appVersions.map(version => (
                <li key={version.version_id}>
                  {version.name}
                  <span className={styles.time}>
                    {formatTime(version.create_time, 'MMM D, YYYY')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel className={styles.detailCard}>
          <VersionItem
            title={t('Application Version')}
            value={get(appDetail, 'latest_app_version.name')}
          />
          <VersionItem title={t('Home')} value={appDetail.home} type="link" />
          <VersionItem title={t('Source repository')} value={appDetail.sources} type="link" />
          <VersionItem title={t('Maintainers')} value={maintainers} type="array" />
          <VersionItem title={t('Related')} />
        </Panel>
      </Section>
    );
  }
}

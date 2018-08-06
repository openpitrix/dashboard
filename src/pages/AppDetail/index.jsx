import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { translate } from 'react-i18next';
import { formatTime } from 'utils';

import Layout, { Grid, Section, BackBtn, Panel, Card } from 'components/Layout';
import Button from 'components/Base/Button';
import Meta from './Meta';
import Information from './Information';
import { QingCloud, Helm } from './Body';
import VersionItem from './versionItem';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore: rootStore,
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

  componentDidMount() {
    this.props.rootStore.setNavFix(true);
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
    const { appStore, repoStore, appVersionStore } = this.props;
    const { appDetail } = appStore;

    const providerName = get(repoStore.repoDetail, 'providers[0]', 'ddd');
    const isHelmApp = providerName === 'kubernetes';
    let screenshots = [];
    if (appDetail.screenshots) {
      screenshots = JSON.parse(appDetail.screenshots) || [];
    }
    if (isHelmApp) {
      return <Helm readme={appVersionStore.readme} />;
    }

    return (
      <Fragment>
        <QingCloud
          app={appDetail}
          currentPic={appStore.currentPic}
          changePicture={this.changePicture}
          pictures={screenshots}
        />
        <Information app={appDetail} repo={repoStore.repoDetail} />
      </Fragment>
    );
  }

  render() {
    const { appStore, appVersionStore } = this.props;
    const { isLoading } = appVersionStore;
    const appDetail = appStore.appDetail;

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
              {this.renderBody()}
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
    if (get(appDetail, 'maintainers')) {
      const objs = JSON.parse(get(appDetail, 'maintainers'));
      objs &&
        objs.map(obj => {
          maintainers.push(obj.name);
          maintainers.push(obj.email);
        });
    }

    return (
      <Section>
        <Card className={styles.detailCard}>
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
            <p>{t('Versions')}</p>
            <ul>
              {appVersions.map(version => (
                <li key={version.version_id}>
                  <span className={styles.name} title={version.name}>
                    {version.name}
                  </span>
                  <span className={styles.time}>
                    {formatTime(version.create_time, 'MMM D, YYYY')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Panel className={styles.detailCard}>
          <VersionItem
            title={t('Application Version')}
            value={get(appDetail, 'latest_app_version.name')}
          />
          <VersionItem title={t('Home')} value={appDetail.home} type="link" />
          <VersionItem title={t('Source repository')} value={appDetail.sources} type="link" />
          <VersionItem title={t('Maintainers')} value={appDetail.maintainers} type="maintainer" />
          <VersionItem title={t('Related')} />
        </Panel>
      </Section>
    );
  }
}

import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { translate } from 'react-i18next';

import Layout, { Grid, Section, BackBtn, Panel, Card, NavLink } from 'components/Layout';
import Button from 'components/Base/Button';
import Meta from './Meta';
import Information from './Information';
import { QingCloud, Helm } from './Body';
import VersionItem from './versionItem';
import { getSessInfo, formatTime } from 'utils';
import { versionCompare } from 'utils/string';

import styles from './index.scss';

@translate()
@inject(({ rootStore, sessInfo }) => ({
  rootStore: rootStore,
  appStore: rootStore.appStore,
  appVersionStore: rootStore.appVersionStore,
  repoStore: rootStore.repoStore,
  sessInfo
}))
@observer
export default class AppDetail extends Component {
  static async onEnter({ appStore, appVersionStore, repoStore }, { appId }) {
    // firstly fetch app version data, because `isLoading` is belong appVersion store
    // this will prevent page flashing
    await appVersionStore.fetchAll({ app_id: appId });

    appStore.currentPic = 1;
    await appStore.fetch(appId);

    if (appStore.appDetail.repo_id) {
      await repoStore.fetchRepoDetail(get(appStore, 'appDetail.repo_id', ''));
    }
    if (appStore.appDetail.latest_app_version) {
      await appVersionStore.fetchPackageFiles(
        get(appStore, 'appDetail.latest_app_version.version_id', '')
      );
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
    const providerName = get(repoStore.repoDetail, 'providers[0]', '');
    const isHelmApp = providerName === 'kubernetes';

    let screenshots = [];
    if (appDetail.screenshots) {
      try {
        screenshots = JSON.parse(appDetail.screenshots) || [];
      } catch (err) {}
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

  renderVersions() {
    const { appStore, appVersionStore, t } = this.props;
    const appDetail = appStore.appDetail;
    const appVersions = appVersionStore.versions.toJSON();

    return (
      <Section>
        <Card className={styles.detailCard}>
          <Link to={`/store/${appDetail.app_id}/deploy`}>
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
              {appVersions
                .sort((verA, verB) => versionCompare(verA.name, verB.name) < 0)
                .map(version => (
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

  render() {
    const { appStore, appVersionStore, sessInfo } = this.props;
    const { isLoading } = appVersionStore;
    const appDetail = appStore.appDetail;
    const isNormal = getSessInfo('role', sessInfo) === 'normal';

    return (
      <Layout
        isLoading={isLoading}
        title="Store"
        hasSearch
        backBtn={isNormal && <BackBtn label="Store" link="/store" />}
      >
        {!isNormal && (
          <NavLink>
            <Link to="/dashboard/apps">My Apps</Link> / {appDetail.name}
          </NavLink>
        )}

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
}

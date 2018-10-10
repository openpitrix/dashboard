import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get, capitalize } from 'lodash';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import Layout, { Grid, Section, BackBtn, Panel, Card, BreadCrumb, Dialog } from 'components/Layout';
import { Button, Icon } from 'components/Base';
import Meta from './Meta';
import Information from './Information';
import { QingCloud, Helm } from './Body';
import VersionItem from './versionItem';
import { formatTime, mappingStatus } from 'utils';
import { versionCompare } from 'utils/string';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore: rootStore,
  appStore: rootStore.appStore,
  appVersionStore: rootStore.appVersionStore,
  repoStore: rootStore.repoStore,
  user: rootStore.user
}))
@observer
export default class AppDetail extends Component {
  async componentDidMount() {
    const { rootStore, appStore, repoStore, appVersionStore, user, match } = this.props;
    const { appId, versionId } = match.params;

    rootStore.setNavFix(true);

    appVersionStore.appId = appId;
    appStore.currentPic = 1;

    await appStore.fetch(appId, true);

    const { isNormal, role } = user;
    const params = { app_id: match.params.appId, noLogin: true };
    //normal user or not login only query 'active' versions
    if (isNormal || !Boolean(role)) {
      params.status = ['active'];
    }
    await appVersionStore.fetchAll(params);

    if (appStore.appDetail.repo_id) {
      await repoStore.fetchRepoDetail(get(appStore, 'appDetail.repo_id', ''), true);
    }

    const providerName = get(repoStore.repoDetail, 'providers[0]', '');
    if (providerName === 'kubernetes' && appStore.appDetail.latest_app_version) {
      await appVersionStore.fetchPackageFiles(
        get(appStore, 'appDetail.latest_app_version.version_id', ''),
        true
      );
    }
  }

  componentWillUnmount() {
    this.props.appVersionStore.loadPageInit();
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

  handleVersion = async (handleType, versionId) => {
    const { appStore, appVersionStore } = this.props;

    await appVersionStore.handle(handleType, versionId);
  };

  showReasonDialog = () => {
    const { appVersionStore } = this.props;
    appVersionStore.reason = '';
    appVersionStore.isDialogOpen = true;
  };

  submitReason = async () => {
    const { appVersionStore } = this.props;
    const { handle, version, reason } = appVersionStore;

    if (!reason) {
      appVersionStore.error('Please input Reject Reason');
    } else {
      await handle('reject', version.version_id);
    }
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
                .map((version, idx) => (
                  <li key={idx} className={classnames(styles[version.status])}>
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

  renderReasonDialog = () => {
    const { appVersionStore, t } = this.props;
    const { isDialogOpen, hideModal, changeReason, reason } = appVersionStore;

    return (
      <Dialog
        title={t('Reject reason')}
        isOpen={isDialogOpen}
        onCancel={hideModal}
        onSubmit={this.submitReason}
      >
        <textarea className={styles.reason} onChange={changeReason} maxLength={500}>
          {reason}
        </textarea>
      </Dialog>
    );
  };

  renderAdminReview = () => {
    const { appVersionStore, match, t } = this.props;
    const { versions } = appVersionStore;
    const versionId = match.params.versionId;
    const result = versions.filter(item => item.version_id === versionId);
    const version = result[0] || versions[0];

    if (!Boolean(version)) {
      return null;
    }

    appVersionStore.version = version;
    const status = version.status;
    const handleMap = {
      // rejected: 'pass',
      submitted: 'pass', // or action 'reject'
      active: 'suspend',
      suspended: 'recover'
    };
    const handle = handleMap[status];

    return (
      <div className={classnames(styles.reviewContent, styles[version.status])}>
        <label className={styles.dot} />
        {t('app_review_desc', { version: version.name })}
        {t(mappingStatus(capitalize(version.status)))}
        {version.status === 'rejected' &&
          version.message && (
            <div className={styles.message}>
              {t('Reject reason')}: {version.message}
            </div>
          )}

        {Boolean(handle) && (
          <div className={styles.operateBtns}>
            <Button type="primary" onClick={() => this.handleVersion(handle, version.version_id)}>
              {t(mappingStatus(capitalize(handle)))}
            </Button>
            {status === 'submitted' && (
              <Button type="delete" onClick={this.showReasonDialog}>
                {t('Reject')}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  render() {
    const { appStore, user } = this.props;
    const { appDetail, isLoading } = appStore;
    const { isNormal, isDev, isAdmin } = user;
    const { path } = this.props.match;

    const isShowReview = isAdmin && path.indexOf('review') > -1;
    const backPath = isShowReview ? 'App Reviews' : 'All Apps';
    const linkPath = isDev ? `My Apps>${appDetail.name}` : `Store>${backPath}>${appDetail.name}`;
    const isHome = path.startsWith('/apps/');
    const backLabel = isHome ? 'Home' : 'Store';
    const backLink = isHome ? '/' : '/store';

    return (
      <Layout
        className={classnames({ [styles.appDetail]: isHome })}
        isLoading={isLoading}
        title="Store"
        hasSearch
        isHome={isHome}
        backBtn={(isNormal || isHome) && <BackBtn label={backLabel} link={backLink} />}
      >
        {(isAdmin || isDev) && !isHome && <BreadCrumb linkPath={linkPath} />}

        <Grid>
          <Section size={8}>
            <Panel className={styles.introCard}>
              <Meta app={appDetail} />
              {this.renderBody()}
            </Panel>
          </Section>

          {this.renderVersions()}
        </Grid>
        {isShowReview && this.renderAdminReview()}
        {this.renderReasonDialog()}
      </Layout>
    );
  }
}

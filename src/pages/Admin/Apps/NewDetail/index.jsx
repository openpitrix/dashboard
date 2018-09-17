import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { pick, assign, get } from 'lodash';
import classNames from 'classnames';

import { Icon, Input, Table, Popover, Modal, Button, Upload } from 'components/Base';
import TagNav from 'components/TagNav';
import Toolbar from 'components/Toolbar';
import DetailBlock from './DetailBlock';
import Layout, { BackBtn, Dialog, Grid, Section, Card, Panel, NavLink } from 'components/Layout';
import StepContent from 'StepContent';
import clusterColumns from './tabs/cluster-columns';

import { getSessInfo } from 'utils';
import styles from './index.scss';

@translate()
@inject(({ rootStore, sessInfo }) =>
  assign(
    pick(rootStore, ['appStore', 'clusterStore', 'appVersionStore', 'repoStore', 'runtimeStore']),
    sessInfo
  )
)
@observer
export default class AppDetail extends Component {
  static async onEnter({ appStore, appVersionStore, repoStore }, { appId }) {
    await appStore.fetch(appId);
    appVersionStore.appId = appId;
    await appVersionStore.fetchAll({ app_id: appId });
    if (appStore.appDetail.repo_id) {
      await repoStore.fetchRepoDetail(appStore.appDetail.repo_id);
    }
  }

  constructor(props) {
    super(props);
    const { clusterStore, runtimeStore, appVersionStore } = this.props;
    clusterStore.loadPageInit();
    runtimeStore.loadPageInit();
    appVersionStore.currentPage = 1;
    appVersionStore.searchWord = '';
    this.appId = props.match.params.appId;
    appVersionStore.appId = this.appId;
    this.loginUser = getSessInfo('user', props.sessInfo);
  }

  /* shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.version !== this.state.version || nextState.createStep !== this.state.createStep
    );
  }*/

  selectVersion = version => {
    const { appVersionStore } = this.props;
    appVersionStore.currentVersion = version;
  };

  createVersionShow = () => {
    const { appVersionStore } = this.props;
    appVersionStore.currentVersion = {};
    appVersionStore.createStep = 1;
  };

  checkFile = file => {
    let result = true;
    const { appVersionStore } = this.props;
    const maxsize = 2 * 1024 * 1024;
    appVersionStore.createError = '';

    if (!/\.(tar|tar\.gz|tra\.bz|zip|tgz)$/.test(file.name.toLocaleLowerCase())) {
      appVersionStore.createError = 'The file format supports TAR, TAR.GZ, TAR.BZ,TGZ and ZIP';
      return false;
    } else if (file.size > maxsize) {
      appVersionStore.createError = 'The file size cannot exceed 2M';
      return false;
    }

    return result;
  };

  uploadFile = base64Str => {
    const { appVersionStore } = this.props;
    appVersionStore.uploadFile = base64Str;
    appVersionStore.createOrModify({ app_id: this.appId });
  };

  setCreateStep = step => {
    const { appVersionStore } = this.props;
    appVersionStore.createStep = step;
  };

  handleVersion = (version, handleType) => {
    const { handle } = this.props.appVersionStore;
    const handleMap = {
      draft: 'submit',
      submitted: 'pass',
      passed: 'release',
      active: 'suspend',
      suspended: 'recover',
      rejected: 'submit'
    };
    handleType = handleType ? handleType : handleMap[version.status];
    handle(handleType, version.version_id);
  };

  renderHandleMenu = () => {
    const { t } = this.props;
    const { showDeleteApp } = this.props.appVersionStore;

    return (
      <div className="operate-menu">
        <span onClick={showDeleteApp}>{t('Delete App')}</span>
      </div>
    );
  };

  deleteApp = () => {
    const { appStore, appVersionStore } = this.props;
    appStore.appId = this.appId;
    appStore.operateType = 'detailDelete';
    appStore.remove();
    appVersionStore.hideModal();
  };

  renderDialog = () => {
    const { t } = this.props;
    const { isDialogOpen, hideModal, dialogType } = this.props.appVersionStore;
    let title = '',
      modalBody = t('Delete App desc'),
      hideFooter = false;

    if (dialogType === 'delete') {
      title = t('Delete Version');
      modalBody = t('Delete Version desc');
    }

    return (
      <Dialog
        title={title}
        isOpen={isDialogOpen}
        onSubmit={this.deleteApp}
        onCancel={hideModal}
        hideFooter={hideFooter}
      >
        {modalBody}
      </Dialog>
    );
  };

  renderTipsDialog = () => {
    const { isTipsOpen, hideModal } = this.props.appVersionStore;
    return (
      <Dialog title="Tips" isOpen={isTipsOpen} onSubmit={hideModal} onCancel={hideModal}>
        <div className={styles.tipsContent}>
          <span className={styles.icon}>
            <Icon name="check" size={48} />
          </span>
          <p className={styles.note}>Version 0.0.2 has been submiited.</p>
          <p className={styles.explain}>
            The review process usually takes 2-3 business days, please be patient.
          </p>
        </div>
      </Dialog>
    );
  };

  changeDetailTab = async tab => {
    const { appStore, clusterStore, appVersionStore, runtimeStore, match } = this.props;
    const { appId } = match.params;
    appStore.detailTab = tab;

    switch (tab) {
      case 'Information':
        const { versions, currentVersion } = appVersionStore;
        if (versions[0] && !currentVersion.version_id) {
          appVersionStore.currentVersion = versions[0];
        }
        break;
      case 'Clusters':
        clusterStore.appId = appId;
        await clusterStore.fetchAll();
        const { clusters } = clusterStore;
        if (clusters.length > 0) {
          const runtimeIds = clusters.map(item => item.runtime_id);
          await runtimeStore.fetchAll({
            status: ['active', 'deleted'],
            runtime_id: runtimeIds
          });
        }
        break;
      case 'Logs':
        break;
    }
  };

  renderToolbar(options = {}) {
    return (
      <Toolbar
        {...pick(options, ['searchWord', 'onSearch', 'onClear', 'onRefresh', 'placeholder'])}
      />
    );
  }

  renderTable(options = {}) {
    return (
      <Table
        {...pick(options, ['columns', 'dataSource', 'isLoading', 'filterList', 'pagination'])}
      />
    );
  }

  renderVersions = () => {
    const { appVersionStore } = this.props;
    const { versions, currentVersion } = appVersionStore;
    const statusMap = {
      draft: 'To be submitted',
      submitted: 'In Review',
      passed: 'Approved',
      active: 'Published',
      suspended: 'Suspend'
    };

    return (
      <div className={styles.versionList}>
        <div className={styles.title}>Versions</div>
        <ul>
          {versions.map(version => (
            <li
              key={version.version_id}
              className={classNames(version.status, {
                selected: version.version_id === currentVersion.version_id
              })}
              onClick={() => this.selectVersion(version)}
            >
              <label className="dot" />
              {version.name}
              <span className="status">{statusMap[version.status]}</span>
            </li>
          ))}
        </ul>
        <div className={styles.addVersion} onClick={() => this.createVersionShow()}>
          + Create version
        </div>
      </div>
    );
  };

  renderCreateVersion = () => {
    const { isLoading, createError } = this.props.appVersionStore;
    const name = 'Create New Version';
    const explain = 'Upload Package';

    return (
      <StepContent name={name} explain={explain}>
        <div className={styles.createVersion}>
          <Upload checkFile={this.checkFile} uploadFile={this.uploadFile}>
            <div className={classNames(styles.upload, { [styles.uploading]: isLoading })}>
              <Icon name="upload" size={48} type="dark" />
              <p className={styles.word}>Please click to select file upload</p>
              <p className={styles.note}>The file format supports TAR, TAR.GZ, TAR.BZ and ZIP</p>
              {isLoading && <div className={styles.loading} />}
            </div>
          </Upload>

          <div className={styles.operateWord}>
            View the
            <span className={styles.link} onClick={() => this.setCreateStep(2)}>
              《Openpitrix Develop Guid》
            </span>
            and learn how to make config files
          </div>
          {createError && (
            <div className={styles.errorNote}>
              <Icon name="error" size={24} />
              {createError}
            </div>
          )}
        </div>
      </StepContent>
    );
  };

  renderCreateSuccess = () => {
    const name = 'Congratulations';
    const explain = 'Your application has been created.';

    return (
      <StepContent className={styles.createVersion} name={name} explain={explain}>
        <div className={styles.checkImg}>
          <label>
            <Icon name="check" size={48} />
          </label>
        </div>
        <div className={styles.operateBtn}>
          <Button type="primary">Deploy & Test</Button>
        </div>
        <div className={styles.operateWord}>
          Also you can
          <span className={styles.link}>edit</span>
          more information for this version
        </div>
      </StepContent>
    );
  };

  renderInformation = () => {
    const { currentVersion } = this.props.appVersionStore;
    if (!currentVersion.version_id) {
      return null;
    }
    const packageName = currentVersion.package_name && currentVersion.package_name.split('/');
    const packageShow = packageName ? packageName[packageName.length - 1] : '';
    const { version_id, name, description } = currentVersion;

    return (
      <div className={styles.versionInfo}>
        <dl>
          <dt>ID</dt>
          <dd>
            <Input className={styles.input} value={version_id} disabled />
          </dd>
        </dl>
        <dl>
          <dt>
            Name
            <p className={styles.note}>
              Use the number to indicate the version number of the application
            </p>
          </dt>
          <dd>
            <Input className={styles.input} value={name} disabled />
          </dd>
        </dl>
        <dl>
          <dt>
            Package
            <p className={styles.note}>The file format supports TAR, TAR.GZ, TAR.BZ and ZIP</p>
          </dt>
          <dd>
            <Upload disabled>
              <div className={styles.fileName}>
                <Icon name="file" size={32} type="dark" />
                <span className={styles.name}>{packageShow}</span>
                <span className={styles.delete}>Delete</span>
              </div>
            </Upload>
            <div className={styles.viewGuide}>
              View the<span className={styles.link}>《Openpitrix Develop Guide》</span> and learn
              how to make config files
            </div>
          </dd>
        </dl>
        <dl>
          <dt>
            Description
            <p className={styles.note}>
              The description of the version will appear on the app details page, and the number of
              words should not exceed 300 words
            </p>
          </dt>
          <dd>
            <textarea className={styles.textarea} defaultValue={description} />
          </dd>
        </dl>
        <dl>
          <dt>Operations</dt>
          <dd>
            <Button type="primary" onClick={() => this.handleVersion(currentVersion)}>
              Submiit
            </Button>
          </dd>
        </dl>
      </div>
    );
  };

  renderNavLink = () => {
    const isAdmin = getSessInfo('role', this.props.sessInfo) === 'admin';
    const { appDetail } = this.props.appStore;

    if (isAdmin) {
      return (
        <NavLink>
          Store / <Link to="/dashboard/apps">All Apps</Link> / {appDetail.name}
        </NavLink>
      );
    }

    return (
      <NavLink>
        <Link to="/dashboard/apps">My Apps</Link> / {appDetail.name}
      </NavLink>
    );
  };

  render() {
    const { appVersionStore, appStore, clusterStore, repoStore, runtimeStore, t } = this.props;
    const { appDetail, detailTab } = appStore;
    const { currentVersion, createStep } = appVersionStore;

    const repoName = get(repoStore.repoDetail, 'name', '');
    const repoProvider = get(repoStore.repoDetail, 'providers[0]', '');

    let toolbarOptions, tableOptions;

    if (detailTab === 'Clusters') {
      toolbarOptions = {
        searchWord: clusterStore.searchWord,
        placeholder: t('Search Clusters'),
        onSearch: clusterStore.onSearch,
        onClear: clusterStore.onClearSearch,
        onRefresh: clusterStore.onRefresh
      };
      tableOptions = {
        columns: clusterColumns(runtimeStore.runtimes),
        dataSource: clusterStore.clusters.toJSON(),
        isLoading: clusterStore.isLoading,
        filterList: [
          {
            key: 'status',
            conditions: [
              { name: t('Pending'), value: 'pending' },
              { name: t('Active'), value: 'active' },
              { name: t('Stopped'), value: 'stopped' },
              { name: t('Suspended'), value: 'suspended' },
              { name: t('Deleted'), value: 'deleted' },
              { name: t('Ceased'), value: 'ceased' }
            ],
            onChangeFilter: clusterStore.onChangeStatus,
            selectValue: clusterStore.selectStatus
          }
        ],
        pagination: {
          tableType: 'Clusters',
          onChange: clusterStore.changePagination,
          total: clusterStore.totalCount,
          current: clusterStore.currentPage
        }
      };
    }

    return (
      <Layout className={styles.appDetail}>
        {this.renderNavLink()}

        <Grid className={styles.appInfo}>
          <DetailBlock appDetail={appDetail} repoName={repoName} repoProvider={repoProvider} />
          {appDetail.status !== 'deleted' && (
            <Popover className={styles.operation} content={this.renderHandleMenu(appDetail.app_id)}>
              <Icon name="more" />
            </Popover>
          )}
        </Grid>

        <Grid className={styles.appVersion}>
          <Section>
            <Card className={styles.noShadow}>{this.renderVersions()}</Card>
          </Section>

          <Section size={8} className={styles.rightInfo}>
            {!currentVersion.version_id &&
              (createStep === 2 ? this.renderCreateSuccess() : this.renderCreateVersion())}
            {currentVersion.version_id && (
              <TagNav tags={['Information', 'Clusters', 'Logs']} changeTag={this.changeDetailTab} />
            )}
            {detailTab === 'Information' ? (
              this.renderInformation()
            ) : (
              <Card className={styles.noShadow}>
                {this.renderToolbar(toolbarOptions)}
                {this.renderTable(tableOptions)}
              </Card>
            )}
            {this.renderDialog()}
            {this.renderTipsDialog()}
          </Section>
        </Grid>
      </Layout>
    );
  }
}

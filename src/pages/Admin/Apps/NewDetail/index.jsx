import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { pick, assign, get, capitalize } from 'lodash';
import classNames from 'classnames';

import { Icon, Input, Table, Popover, Modal, Button, Upload } from 'components/Base';
import Layout, { BackBtn, Dialog, Grid, Section, Card, Panel, NavLink } from 'components/Layout';
import TagNav from 'components/TagNav';
import Toolbar from 'components/Toolbar';
import DetailBlock from './DetailBlock';
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
    appVersionStore.currentVersion = {};
    await appVersionStore.fetchAll({ app_id: appId });
    if (appStore.appDetail.repo_id) {
      await repoStore.fetchRepoDetail(appStore.appDetail.repo_id);
    }
  }

  constructor(props) {
    super(props);
    const { clusterStore, runtimeStore, appVersionStore, match } = this.props;
    clusterStore.loadPageInit();
    runtimeStore.loadPageInit();
    appVersionStore.loadPageInit();
    appVersionStore.appId = match.params.appId;
    this.loginUser = getSessInfo('user', props.sessInfo);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.currentVersion !== this.props.currentVersion;
  }

  selectVersion = version => {
    const { appVersionStore } = this.props;
    appVersionStore.currentVersion = version;
    appVersionStore.name = version.name;
    appVersionStore.packageName = version.package_name;
    appVersionStore.description = version.description;
    appVersionStore.uploadFile = '';
    appVersionStore.createError = '';
    appVersionStore.createStep = 1;
  };

  createVersionShow = () => {
    const { appVersionStore } = this.props;
    const newVersion = { name: 'New version', status: 'create' };

    appVersionStore.currentVersion = newVersion;
    appVersionStore.createStep = 1;
    if (get(appVersionStore.versions[0], 'name') !== 'New version') {
      appVersionStore.versions.unshift(newVersion);
    }
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

  uploadFile = (base64Str, file) => {
    const { appVersionStore } = this.props;
    appVersionStore.isLoading = true;
    appVersionStore.uploadFile = base64Str;
    appVersionStore.packageName = file.name;
    setTimeout(() => {
      appVersionStore.isLoading = false;
    }, 1000);
  };

  createVersion = (base64Str, file) => {
    const { appVersionStore } = this.props;
    appVersionStore.currentVersion = {};
    appVersionStore.uploadFile = base64Str;
    appVersionStore.createOrModify();
  };

  deleteFile = isDisabled => {
    if (!isDisabled) {
      const { appVersionStore } = this.props;
      appVersionStore.uploadFile = '';
      appVersionStore.packageName = '';
    }
  };

  setCreateStep = step => {
    const { appVersionStore } = this.props;
    appVersionStore.createStep = step;
  };

  handleVersion = async (version, handleType) => {
    const { appVersionStore } = this.props;

    if (handleType === 'delete') {
      appVersionStore.showDelete('deleteVersion');
    } else {
      await appVersionStore.handle(handleType, version.version_id);
      const newVersion = appVersionStore.versions.filter(
        item => item.version_id === version.version_id
      );
      appVersionStore.currentVersion = newVersion[0];
    }
  };

  renderHandleMenu = () => {
    const { t } = this.props;
    const { showDelete } = this.props.appVersionStore;

    return (
      <div className="operate-menu">
        <span onClick={() => showDelete('deleteApp')}>{t('Delete App')}</span>
      </div>
    );
  };

  delete = () => {
    const { appStore, appVersionStore } = this.props;
    if (appVersionStore.dialogType === 'deleteVersion') {
      appVersionStore.handle('delete', appVersionStore.currentVersion.version_id);
    } else {
      appStore.operateType = 'detailDelete';
      appStore.remove();
    }
    appVersionStore.hideModal();
  };

  renderDialog = () => {
    const { t } = this.props;
    const { isDialogOpen, hideModal, dialogType } = this.props.appVersionStore;
    let title = t('Delete App'),
      modalBody = t('Delete App desc');

    if (dialogType === 'deleteVersion') {
      title = t('Delete Version');
      modalBody = t('Delete Version desc');
    }

    return (
      <Dialog title={title} isOpen={isDialogOpen} onSubmit={this.delete} onCancel={hideModal}>
        {modalBody}
      </Dialog>
    );
  };

  renderTipsDialog = () => {
    const { isTipsOpen, hideModal, name } = this.props.appVersionStore;
    return (
      <Dialog title="Tips" isOpen={isTipsOpen} onCancel={hideModal} hideFooter>
        <div className={styles.tipsContent}>
          <span className={styles.icon}>
            <Icon name="check" size={48} />
          </span>
          <p className={styles.note}>Version {name} has been submiited.</p>
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
    const { appVersionStore, appStore, sessInfo } = this.props;
    const { versions, currentVersion } = appVersionStore;
    const role = getSessInfo('role', sessInfo);

    return (
      <div className={styles.versionList}>
        <div className={styles.title}>Versions</div>
        <ul>
          {versions.map(version => (
            <li
              key={version.version_id || version.name}
              className={classNames(version.status, {
                selected: version.version_id === currentVersion.version_id
              })}
              onClick={() => this.selectVersion(version)}
            >
              <label className="dot" />
              {version.name}
              <span className="status">{capitalize(version.status)}</span>
            </li>
          ))}
        </ul>
        {role === 'developer' &&
          appStore.appDetail.status !== 'deleted' && (
            <div className={styles.addVersion} onClick={() => this.createVersionShow()}>
              + Create version
            </div>
          )}
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
          <Upload checkFile={this.checkFile} uploadFile={this.createVersion}>
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
    const { currentVersion } = this.props.appVersionStore;
    const name = 'Congratulations';
    const explain = 'New version has been created.';

    return (
      <StepContent className={styles.createVersion} name={name} explain={explain}>
        <div className={styles.checkImg}>
          <label>
            <Icon name="check" size={48} />
          </label>
        </div>
        <div className={styles.operateBtn}>
          <Link to={`/store/${currentVersion.app_id}/deploy`}>
            <Button type="primary">Deploy & Test</Button>
          </Link>
        </div>
        <div className={styles.operateWord}>
          Also you can &nbsp;
          <span className={styles.link} onClick={() => this.selectVersion(currentVersion)}>
            edit
          </span>&nbsp; more information for this version
        </div>
      </StepContent>
    );
  };

  renderInformation = () => {
    const { appVersionStore, appStore, sessInfo } = this.props;
    const { currentVersion, createStep, createError, isLoading } = appVersionStore;
    if (!currentVersion.version_id || createStep === 2) {
      return null;
    }

    const { appDetail } = appStore;
    const role = getSessInfo('role', sessInfo);
    const editStatus = ['draft', 'rejected'];
    const isDisabled =
      !editStatus.includes(currentVersion.status) ||
      role !== 'developer' ||
      appDetail.status === 'deleted';
    const handleMap = {
      developer: {
        draft: 'submit',
        submitted: 'cancel',
        passed: 'release',
        suspended: 'delete',
        rejected: 'submit'
      },
      admin: {
        rejected: 'pass',
        submitted: 'pass', // or action 'reject'
        active: 'suspend',
        suspended: 'recover'
      }
    };

    const hanleType = handleMap[role] && handleMap[role][currentVersion.status];

    return (
      <div className={styles.versionInfo}>
        <dl>
          <dt>ID</dt>
          <dd>
            <Input className={styles.input} value={currentVersion.version_id} disabled readOnly />
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
            <Input
              className={styles.input}
              value={appVersionStore.name}
              onChange={appVersionStore.changeName}
              disabled={isDisabled}
            />
          </dd>
        </dl>
        <dl>
          <dt>
            Package
            <p className={styles.note}>The file format supports TAR, TAR.GZ, TAR.BZ and ZIP</p>
          </dt>
          <dd className={styles.createVersion}>
            {appVersionStore.packageName && (
              <div className={classNames(styles.fileName, { [styles.disabledFile]: isDisabled })}>
                <Icon name="file" size={32} type="dark" />
                <span className={styles.name}>{appVersionStore.packageName}</span>
                <span className={styles.delete} onClick={() => this.deleteFile(isDisabled)}>
                  Delete
                </span>
              </div>
            )}
            {!appVersionStore.packageName && (
              <Upload checkFile={this.checkFile} uploadFile={this.uploadFile} disabled={isDisabled}>
                <div
                  className={classNames(styles.upload, styles.editFile, {
                    [styles.uploading]: isLoading
                  })}
                >
                  <Icon name="upload" size={48} type="dark" />
                  <p className={styles.word}>Please click to select file upload</p>
                  <p className={styles.note}>
                    The file format supports TAR, TAR.GZ, TAR.BZ and ZIP
                  </p>
                  {isLoading && <div className={styles.loading} />}
                </div>
              </Upload>
            )}
            <div className={styles.viewGuide}>
              View the<span className={styles.link}>《Openpitrix Develop Guide》</span> and learn
              how to make config files
            </div>
            {createError && (
              <div className={classNames(styles.errorNote, styles.editError)}>
                <Icon name="error" size={24} />
                {createError}
              </div>
            )}
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
            <textarea
              className={styles.textarea}
              defaultValue={appVersionStore.description}
              disabled={isDisabled}
              onChange={appVersionStore.changeDescription}
            />
          </dd>
        </dl>
        {hanleType &&
          appDetail.status !== 'deleted' && (
            <dl>
              <dt>Operations</dt>
              <dd>
                <Button
                  type="primary"
                  onClick={() => this.handleVersion(currentVersion, hanleType)}
                >
                  {capitalize(hanleType)}
                </Button>

                {currentVersion.status === 'submitted' &&
                  role === 'admin' && (
                    <Button onClick={() => this.handleVersion(currentVersion, 'reject')}>
                      {capitalize('reject')}
                    </Button>
                  )}
              </dd>
            </dl>
          )}
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

    const isShowCreate = !currentVersion.version_id || createStep === 2;

    return (
      <Layout className={styles.appDetail} noNotification={isShowCreate}>
        {this.renderNavLink()}

        <Grid className={styles.appInfo}>
          <DetailBlock
            appDetail={appDetail}
            repoName={repoName}
            repoProvider={repoProvider}
            noDeploy={appDetail.status === 'deleted'}
          />
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
            {isShowCreate &&
              (createStep === 2 ? this.renderCreateSuccess() : this.renderCreateVersion())}
            {!isShowCreate && (
              <Fragment>
                <TagNav
                  tags={['Information', 'Clusters', 'Logs']}
                  changeTag={this.changeDetailTab}
                />
                {detailTab === 'Information' ? (
                  this.renderInformation()
                ) : (
                  <Card className={styles.noShadow}>
                    {this.renderToolbar(toolbarOptions)}
                    {this.renderTable(tableOptions)}
                  </Card>
                )}
              </Fragment>
            )}
            {this.renderDialog()}
            {this.renderTipsDialog()}
          </Section>
        </Grid>
      </Layout>
    );
  }
}

import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { pick, assign, get } from 'lodash';
import classNames from 'classnames';

import { Icon, Input, Table, Popover, Modal, Button, Upload } from 'components/Base';
import TagNav from 'components/TagNav';
import Toolbar from 'components/Toolbar';
import AppBlock from 'components/DetailBlock/AppBlock';
import Layout, { BackBtn, Dialog, Grid, Section, Card, Panel } from 'components/Layout';
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
    this.loginUser = getSessInfo('user', props.sessInfo);
    this.state = {
      createStep: 1,
      version: {}
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.version !== this.state.version || nextState.createStep !== this.state.createStep
    );
  }

  selectVersion = version => {
    const { versions } = this.props.appVersionStore;
    versions.map(item => {
      delete item.selected;
    });
    version.selected = true;
    this.setState({
      version: version
    });
  };

  createVersion = () => {
    this.setState({
      createStep: 1,
      version: ''
    });
  };

  setCreateStep = step => {
    this.setState({
      createStep: step
    });
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
        const { versions } = appVersionStore;
        this.setState({
          version: versions[0]
        });
        versions[0].selected = true;
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
    const { versions } = appVersionStore;

    return (
      <div className={styles.versionList}>
        <div className={styles.title}>Versions</div>
        <ul>
          {versions.map(version => (
            <li
              key={version.version_id}
              className={classNames({ [styles.selected]: version.selected })}
              onClick={() => this.selectVersion(version)}
            >
              <label className={styles.dot} />
              {version.name}
              <span className={styles.status}>To be submitted</span>
            </li>
          ))}
        </ul>
        <div className={styles.addVersion} onClick={() => this.createVersion()}>
          + Create version
        </div>
      </div>
    );
  };

  renderCreateVersion = () => {
    const { isLoading, errorMsg } = this.props.appVersionStore;
    const name = 'Create New Application';
    const explain = 'Upload Package';

    return (
      <StepContent name={name} explain={explain}>
        <div className={styles.createVersion}>
          <Upload>
            <div className={classNames(styles.upload, { [styles.uploading]: isLoading })}>
              <Icon name="upload" size={48} type="dark" />
              <p className={styles.word}>Please click to select file upload</p>
              <p className={styles.note}>The file format supports TAR, TAR.GZ, TAR.BZ and ZIP</p>
              {loading && <div className={styles.loading} />}
            </div>
          </Upload>

          <div className={styles.operateWord}>
            View the
            <span className={styles.link} onClick={() => this.setCreateStep(2)}>
              《Openpitrix Develop Guid》
            </span>
            and learn how to make config files
          </div>
          {errorMsg && (
            <div className={styles.errorNote}>
              <Icon name="error" size={24} />
              {errorMsg}
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
    const { version } = this.state;
    if (!version) {
      return null;
    }
    const packageName = version.package_name && version.package_name.split('/');
    const packageShow = packageName ? packageName[packageName.length - 1] : '';
    const { version_id, name, description } = version;

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
            <Input className={styles.input} value={name} />
          </dd>
        </dl>
        <dl>
          <dt>
            Package
            <p className={styles.note}>The file format supports TAR, TAR.GZ, TAR.BZ and ZIP</p>
          </dt>
          <dd>
            <div className={styles.fileName}>
              <Icon name="file" size={32} type="dark" />
              <span className={styles.name}>{packageShow}</span>
              <span className={styles.delete}>Delete</span>
            </div>
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
            <textarea className={styles.textarea} value={description} />
          </dd>
        </dl>
        <dl>
          <dt>Operations</dt>
          <dd>
            <Button type="primary">Submiit</Button>
          </dd>
        </dl>
      </div>
    );
  };

  render() {
    const { appStore, clusterStore, repoStore, runtimeStore, t } = this.props;
    const { appDetail, detailTab } = appStore;
    const { version, createStep } = this.state;

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
      <Layout backBtn={<BackBtn label="apps" link="/dashboard/apps" />}>
        <Grid className={styles.appInfo}>
          <AppBlock appDetail={appDetail} repoName={repoName} repoProvider={repoProvider} />
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
            {!version &&
              (createStep === 2 ? this.renderCreateSuccess() : this.renderCreateVersion())}
            {version && (
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

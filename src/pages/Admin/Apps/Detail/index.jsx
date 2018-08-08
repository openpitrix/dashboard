import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { pick, assign, get } from 'lodash';

import { Icon, Input, Table, Popover, Modal } from 'components/Base';
import TagNav from 'components/TagNav';
import Toolbar from 'components/Toolbar';
import AppCard from 'components/DetailCard/AppCard';
import Layout, { BackBtn, Dialog, Grid, Section, Card, Panel } from 'components/Layout';
import clusterColumns from './tabs/cluster-columns';
import versionColumns from './tabs/version-columns';

import { getSessInfo } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore, sessInfo }) =>
  assign(pick(rootStore, ['appStore', 'clusterStore', 'appVersionStore', 'repoStore']), sessInfo)
)
@observer
export default class AppDetail extends Component {
  static async onEnter({ appStore, repoStore }, { appId }) {
    await appStore.fetch(appId);
    if (appStore.appDetail.repo_id) {
      await repoStore.fetchRepoDetail(appStore.appDetail.repo_id);
    }
  }

  constructor(props) {
    super(props);
    this.appId = props.match.params.appId;
    this.loginUser = getSessInfo('user', props.sessInfo);
  }

  renderHandleMenu = appId => {
    const { t } = this.props;
    const { showCreateVersion, showDeleteApp } = this.props.appVersionStore;

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/app/${appId}/deploy`}>{t('Deploy App')}</Link>
        <span onClick={showCreateVersion}>{t('Create version')}</span>
        <span onClick={showDeleteApp}>{t('Delete App')}</span>
      </div>
    );
  };

  handleCreateVersion = async () => {
    await this.props.appVersionStore.handleCreateVersion(this.appId);
  };

  renderOpsModal = () => {
    const { appVersionStore, t } = this.props;
    const {
      isModalOpen,
      hideModal,
      changeName,
      changePackage,
      changeDescription
    } = appVersionStore;

    return (
      <Modal
        title={t('Create App Version')}
        visible={isModalOpen}
        onCancel={hideModal}
        onOk={this.handleCreateVersion}
      >
        <form className="formContent">
          <div>
            <label className={styles.name}>{t('Name')}</label>
            <Input
              className={styles.input}
              name="name"
              maxLength="50"
              value={appVersionStore.name}
              onChange={changeName}
              required
            />
          </div>
          <div>
            <label className={styles.name}>{t('Package address')}</label>
            <Input
              name="package_name"
              maxLength="100"
              required
              value={appVersionStore.packageName}
              onChange={changePackage}
              placeholder="http://openpitrix.pek3a.qingstor.com/package/zk-0.1.0.tgz"
            />
          </div>
          <div className="textareaItem">
            <label>{t('Description')}</label>
            <textarea
              name="description"
              maxLength="500"
              value={appVersionStore.description}
              onChange={changeDescription}
            />
          </div>
        </form>
      </Modal>
    );
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

  deleteApp = () => {
    const { appStore, appVersionStore } = this.props;
    appStore.appId = this.appId;
    appStore.operateType = 'detailDelete';
    appStore.remove();
    appVersionStore.hideModal();
  };

  onRefresh = () => {
    const { currentClusterPage, swCluster } = this.props.appStore;
    const { fetchAll } = this.props.clusterStore;
    fetchAll({ page: currentClusterPage, search_word: swCluster, app_id: this.appId });
  };

  onSearch = search_word => {
    const { changeClusterSearchWord } = this.props.appStore;
    const { fetchAll } = this.props.clusterStore;
    fetchAll({ search_word, app_id: this.appId });
    changeClusterSearchWord(search_word);
  };

  onClearSearch = () => {
    this.onSearch('');
  };

  onChangeStatus = async status => {
    const { clusterStore } = this.props;
    clusterStore.selectStatus = clusterStore.selectStatus === status ? '' : status;
    await clusterStore.fetchAll({ status: clusterStore.selectStatus, app_id: this.appId });
  };

  changePagination = page => {
    const { setClusterPage } = this.props.appStore;
    const { fetchAll } = this.props.clusterStore;
    setClusterPage(page);
    fetchAll({ app_id: this.appId, page });
  };

  changeVersionPagination = page => {
    const { appStore, appVersionStore } = this.props;
    appStore.setCurrentVersionPage(page);
    appVersionStore.fetchAll({ app_id: this.appId, page });
  };

  changeDetailTab = async tab => {
    const { appStore, clusterStore, appVersionStore, match } = this.props;
    const { appId } = match.params;

    appStore.detailTab = tab;
    if (tab === 'Clusters') {
      await clusterStore.fetchAll({ app_id: appId });
    }
    if (tab === 'Versions') {
      await appVersionStore.fetchAll({ app_id: appId });
    }
  };

  onSearchVersion = words => {
    const { appStore, appVersionStore } = this.props;
    appStore.swVersion = words;
    appVersionStore.fetchAll({ search_word: words, app_id: this.appId });
  };

  onClearSearchVersion = () => {
    this.onSearchVersion('');
  };

  onRefreshVersion = () => {
    const { appStore, appVersionStore } = this.props;
    const { swVersion, currentVersionPage } = appStore;
    appVersionStore.fetchAll({
      search_word: swVersion,
      app_id: this.appId,
      page: currentVersionPage
    });
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

  render() {
    const { appStore, clusterStore, appVersionStore, repoStore, t } = this.props;
    const {
      appDetail,
      currentClusterPage,
      swCluster,
      swVersion,
      detailTab,
      currentVersionPage
    } = appStore;

    const { selectStatus } = clusterStore;
    const repoName = get(repoStore.repoDetail, 'name', '');
    const repoProvider = get(repoStore.repoDetail, 'providers[0]', '');

    let toolbarOptions, tableOptions;

    if (detailTab === 'Clusters') {
      toolbarOptions = {
        searchWord: swCluster,
        placeholder: t('Search Clusters'),
        onSearch: this.onSearch,
        onClear: this.onClearSearch,
        onRefresh: this.onRefresh
      };
      tableOptions = {
        columns: clusterColumns,
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
            onChangeFilter: this.onChangeStatus,
            selectValue: selectStatus
          }
        ],
        pagination: {
          tableType: 'Clusters',
          onChange: this.changePagination,
          total: clusterStore.totalCount,
          current: currentClusterPage
        }
      };
    }

    if (detailTab === 'Versions') {
      toolbarOptions = {
        searchWord: swVersion,
        placeholder: t('Search Version'),
        onSearch: this.onSearchVersion,
        onClear: this.onClearSearchVersion,
        onRefresh: this.onRefreshVersion
      };
      tableOptions = {
        columns: versionColumns,
        dataSource: appVersionStore.versions.toJSON(),
        isLoading: appVersionStore.isLoading,
        pagination: {
          tableType: 'Versions',
          onChange: this.changeVersionPagination,
          total: appVersionStore.totalCount,
          current: currentVersionPage
        }
      };
    }

    return (
      <Layout backBtn={<BackBtn label="apps" link="/dashboard/apps" />}>
        <Grid>
          <Section>
            <Card>
              <AppCard appDetail={appDetail} repoName={repoName} repoProvider={repoProvider} />
              {appDetail.status !== 'deleted' && (
                <Popover className="operation" content={this.renderHandleMenu(appDetail.app_id)}>
                  <Icon name="more" />
                </Popover>
              )}
            </Card>
          </Section>

          <Section size={8}>
            <Panel>
              <TagNav tags={['Clusters', 'Versions']} changeTag={this.changeDetailTab} />
              <Card className={styles.tabCard}>
                {this.renderToolbar(toolbarOptions)}
                {this.renderTable(tableOptions)}
              </Card>
              {this.renderOpsModal()}
              {this.renderDialog()}
            </Panel>
          </Section>
        </Grid>
      </Layout>
    );
  }
}

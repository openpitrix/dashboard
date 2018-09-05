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
  static async onEnter({ appStore, repoStore }, { appId }) {
    await appStore.fetch(appId);
    if (appStore.appDetail.repo_id) {
      await repoStore.fetchRepoDetail(appStore.appDetail.repo_id);
    }
  }

  constructor(props) {
    super(props);
    const { clusterStore, appVersionStore } = this.props;
    clusterStore.loadPageInit();
    appVersionStore.loadPageInit();
  }

  changeDetailTab = async tab => {
    const { appStore, clusterStore, appVersionStore, runtimeStore, match } = this.props;
    const { appId } = match.params;
    appStore.detailTab = tab;

    if (tab === 'Clusters') {
      clusterStore.appId = appId;
      await clusterStore.fetchAll();
      const { clusters } = clusterStore;
      if (clusters.length > 0) {
        runtimeStore.loadPageInit();
        appVersionStore.loadPageInit();
        const versionIds = clusters.map(item => item.version_id);
        const runtimeIds = clusters.map(item => item.runtime_id);
        await runtimeStore.fetchAll({
          status: ['active', 'deleted'],
          runtime_id: runtimeIds
        });
        await appVersionStore.fetchAll({
          status: ['active', 'deleted'],
          version_id: versionIds
        });
      }
    } else if (tab === 'Versions') {
      appVersionStore.appId = appId;
      await appVersionStore.fetchAll({ app_id: appId });
    }
  };

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
    const { appId } = this.props.match.params;
    await this.props.appVersionStore.handleCreateVersion(appId);
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
    const { appStore, clusterStore, appVersionStore, repoStore, runtimeStore, t } = this.props;
    const { appDetail, detailTab } = appStore;

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
        columns: clusterColumns(runtimeStore.runtimes, appVersionStore.versions),
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
    } else if (detailTab === 'Versions') {
      toolbarOptions = {
        searchWord: appVersionStore.searchWord,
        placeholder: t('Search Version'),
        onSearch: appVersionStore.onSearch,
        onClear: appVersionStore.onClearSearch,
        onRefresh: appVersionStore.onRefresh
      };
      tableOptions = {
        columns: versionColumns,
        dataSource: appVersionStore.versions.toJSON(),
        isLoading: appVersionStore.isLoading,
        filterList: [
          {
            key: 'status',
            conditions: [
              { name: t('Active'), value: 'active' },
              { name: t('Deleted'), value: 'deleted' }
            ],
            onChangeFilter: appVersionStore.onChangeStatus,
            selectValue: appVersionStore.selectStatus
          }
        ],
        pagination: {
          tableType: 'Versions',
          onChange: appVersionStore.changePagination,
          total: appVersionStore.totalCount,
          current: appVersionStore.currentPage
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

              <Card hasTable>
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

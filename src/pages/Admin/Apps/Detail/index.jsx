import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { pick, assign, get } from 'lodash';

import { Icon, Input, Table, Pagination, Popover, Modal } from 'components/Base';
import VersionList from 'components/VersionList';
import TagNav from 'components/TagNav';
import Toolbar from 'components/Toolbar';
import AppCard from 'components/DetailCard/AppCard';
import Layout, { BackBtn, Dialog, Grid, Section, Card, Panel } from 'components/Layout';
import columns from './columns';
import { getSessInfo } from 'utils';

import styles from './index.scss';

@inject(({ rootStore, sessInfo }) =>
  assign(pick(rootStore, ['appStore', 'clusterStore', 'appVersionStore', 'repoStore']), sessInfo)
)
@observer
export default class AppDetail extends Component {
  static async onEnter({ appStore, clusterStore, appVersionStore, repoStore }, { appId }) {
    appStore.deleteResult = {};
    await appStore.fetch(appId);
    await appVersionStore.fetchAll({ app_id: appId });
    await clusterStore.fetchAll({ app_id: appId });
    if (appStore.appDetail.repo_id) {
      repoStore.fetchRepoDetail(appStore.appDetail.repo_id);
    }
  }

  constructor(props) {
    super(props);
    this.appId = props.match.params.appId;
    this.loginUser = getSessInfo('user', props.sessInfo);
  }

  componentDidUpdate() {
    const { appDetail } = this.props.appStore;
    if (!appDetail.app_id) {
      setTimeout(() => {
        history.back();
      }, 2000);
    }
  }

  renderHandleMenu = appId => {
    const { showCreateVersion, showDeleteApp } = this.props.appVersionStore;

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/app/${appId}/deploy`}>Deploy App</Link>
        <span onClick={showCreateVersion}>Create version</span>
        <span onClick={showDeleteApp}>Delete App</span>
      </div>
    );
  };

  handleCreateVersion = async e => {
    await this.props.appVersionStore.handleCreateVersion(e, {
      app_id: this.appId,
      owner: this.loginUser
    });
  };

  renderOpsModal = () => {
    const { isModalOpen, hideModal } = this.props.appVersionStore;

    return (
      <Modal
        title={`Create App Version`}
        visible={isModalOpen}
        onCancel={hideModal}
        onOk={this.handleCreateVersion}
      >
        <div className="formContent">
          <div>
            <label className={styles.name}>Name</label>
            <Input className={styles.input} name="name" maxLength="50" />
          </div>
          <div>
            <label className={styles.name}>Package Name</label>
            <Input
              name="package_name"
              maxLength="100"
              required
              placeholder="http://openpitrix.pek3a.qingstor.com/package/zk-0.1.0.tgz"
            />
          </div>
          <div className="textareaItem">
            <label>Description</label>
            <textarea name="description" maxLength="500" />
          </div>
        </div>
      </Modal>
    );
  };

  renderDialog = () => {
    const { isDialogOpen, hideModal, remove, dialogType, versions } = this.props.appVersionStore;
    let title = '',
      modalBody = 'Are you sure delete this App?',
      hideFooter = false;

    if (dialogType === 'show_all') {
      title = 'Delete Version';
      modalBody = <VersionList versions={versions} />;
      hideFooter = true;
    } else if (dialogType === 'delete') {
      title = 'Delete Version';
      modalBody = 'Are you sure delete this Version?';
    }

    return (
      <Dialog
        title={title}
        isOpen={isDialogOpen}
        onSubmit={this.props.appStore.remove}
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
    await this.fetchAll({ status: clusterStore.selectStatus, app_id: this.appId });
  };

  changePagination = page => {
    const { setClusterPage } = this.props.appStore;
    const { fetchAll } = this.props.clusterStore;
    setClusterPage(page);
    fetchAll({ app_id: this.appId, page });
  };

  render() {
    const { appStore, clusterStore, appVersionStore, repoStore } = this.props;
    const { appDetail, currentClusterPage, swCluster } = appStore;
    const { versions, showAllVersions, notifyMsg, hideMsg } = appVersionStore;
    const appNotifyMsg = appStore.notifyMsg;
    const appHideMsg = appStore.hideMsg;
    const { clusters, isLoading, selectStatus } = clusterStore;
    const repoName = get(repoStore.repoDetail, 'name', '');

    const filterList = [
      {
        key: 'status',
        conditions: [
          { name: 'Active', value: 'active' },
          { name: 'Stopped', value: 'stopped' },
          { name: 'Ceased', value: 'ceased' },
          { name: 'Pending', value: 'pending' },
          { name: 'Suspended', value: 'suspended' },
          { name: 'Deleted', value: 'deleted' }
        ],
        onChangeFilter: this.onChangeStatus,
        selectValue: selectStatus
      }
    ];

    const pagination = {
      tableType: 'Clusters',
      onChange: this.changePagination,
      total: clusterStore.totalCount,
      current: currentClusterPage
    };

    return (
      <Layout
        msg={notifyMsg || appNotifyMsg}
        hideMsg={hideMsg || appHideMsg}
        backBtn={<BackBtn label="apps" link="/dashboard/apps" />}
      >
        <Grid>
          <Section>
            <Card>
              <AppCard appDetail={appDetail} repoName={repoName} />
              {appDetail.status !== 'deleted' && (
                <Popover className="operation" content={this.renderHandleMenu(appDetail.app_id)}>
                  <Icon name="more" />
                </Popover>
              )}
            </Card>
            <Card className={styles.versionCard}>
              <div className={styles.title}>
                Versions
                <div className={styles.all} onClick={showAllVersions}>
                  All Versions →
                </div>
              </div>
              <VersionList versions={versions.slice(0, 4)} />
            </Card>
          </Section>

          <Section size={8}>
            <Panel>
              <TagNav tags={[{ id: 1, name: 'Clusters' }]} curTag="Clusters" />
              <Card>
                <Toolbar
                  placeholder="Search Cluster Name"
                  searchWord={swCluster}
                  onSearch={this.onSearch}
                  onClear={this.onClearSearch}
                  onRefresh={this.onRefresh}
                />
                <Table
                  columns={columns}
                  dataSource={clusters.toJSON()}
                  isLoading={isLoading}
                  filterList={filterList}
                />
                <Pagination
                  onChange={this.changePagination}
                  total={clusterStore.totalCount}
                  current={currentClusterPage}
                  pagination={pagination}
                />
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

import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { pick, assign, get } from 'lodash';

import { Icon, Button, Input, Table, Pagination, Popover, Modal } from 'components/Base';
import AppCard from 'components/DetailCard/AppCard';
import VersionList from 'components/VersionList';
import TagNav from 'components/TagNav';
import Layout, { BackBtn, Dialog } from 'components/Layout/Admin';
import columns from './columns';

import { getSessInfo } from 'utils';

import styles from './index.scss';

@inject(({ rootStore, sessInfo }) =>
  assign(pick(rootStore, ['appStore', 'clusterStore', 'appVersionStore', 'repoStore']), sessInfo)
)
@observer
export default class AppDetail extends Component {
  static async onEnter({ appStore, clusterStore, appVersionStore, repoStore }, { appId }) {
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

  renderHandleMenu = appId => {
    const { showCreateVersion } = this.props.appVersionStore;
    const { appDetail } = this.props.appStore;

    return (
      <div className="operate-menu">
        {appDetail.status !== 'deleted' && (
          <Link to={`/dashboard/app/${appId}/deploy`}>Deploy App</Link>
        )}
        <span onClick={showCreateVersion}>Create version</span>
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
    const { appVersionStore } = this.props;
    const { isModalOpen, hideModal, handleVersion, versions } = appVersionStore;
    let width = 500,
      modalTitle = '',
      modalBody = null,
      onSubmit = () => {},
      resetProps = {};

    if (handleVersion.action === 'create') {
      (width = 620), (modalTitle = 'Create App Version');
      onSubmit = this.handleCreateVersion.bind(this);
      modalBody = (
        <Fragment>
          <div className={styles.inputItem}>
            <label className={styles.name}>Name</label>
            <Input className={styles.input} name="name" maxlength="50" required />
          </div>
          <div className={styles.inputItem}>
            <label className={styles.name}>Package Name</label>
            <Input
              className={styles.input}
              name="package_name"
              maxlength="100"
              required
              placeholder="http://openpitrix.pek3a.qingstor.com/package/zk-0.1.0.tgz"
            />
          </div>
          <div className={styles.inputItem}>
            <label className={classNames(styles.name, styles.textareaName)}>Description</label>
            <textarea className={styles.textarea} name="description" maxlength="500" />
          </div>
        </Fragment>
      );
    }

    if (handleVersion.action === 'delete') {
      modalTitle = 'Delete Version';
      modalBody = <div className={styles.noteWord}>Are you sure delete this Version?</div>;
    }

    if (handleVersion.action === 'show_all') {
      modalTitle = 'All Versions';
      modalBody = <VersionList versions={versions} />;
      resetProps.noActions = true;
    }

    return (
      <Dialog
        width={width}
        title={modalTitle}
        isOpen={isModalOpen}
        onCancel={hideModal}
        onSubmit={onSubmit}
        {...resetProps}
      >
        {modalBody}
      </Dialog>
    );
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
    const { clusters, isLoading } = clusterStore;
    const repoName = get(repoStore.repoDetail, 'name', '');

    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg}>
        <BackBtn label="apps" link="/dashboard/apps" />
        <div className={styles.appDetail}>
          <div className={styles.leftInfo}>
            <div className={styles.detailOuter}>
              <AppCard appDetail={appDetail} repoName={repoName} />
              <Popover
                className={styles.operation}
                content={this.renderHandleMenu(appDetail.app_id)}
              >
                <Icon name="more" />
              </Popover>
            </div>
            <div className={styles.versionOuter}>
              <div className={styles.title}>
                Versions
                <div className={styles.all} onClick={showAllVersions}>
                  All Versions →
                </div>
              </div>
              <VersionList versions={versions.slice(0, 4)} />
            </div>
          </div>

          <div className={styles.rightInfo}>
            <div className={styles.wrapper}>
              <TagNav tags={[{ id: 1, name: 'Clusters' }]} curTag="Clusters" />

              <div className={styles.toolbar}>
                <Input.Search
                  className={styles.search}
                  placeholder="Search Cluster Name"
                  onSearch={this.onSearch}
                  onClear={this.onClearSearch}
                  value={swCluster}
                  maxlength="50"
                />
                <Button className={styles.buttonRight} onClick={this.onRefresh}>
                  <Icon name="refresh" />
                </Button>
              </div>

              <Table columns={columns} dataSource={clusters.toJSON()} isLoading={isLoading} />
            </div>
            <Pagination
              onChange={this.changePagination}
              total={clusterStore.totalCount}
              current={currentClusterPage}
            />
          </div>
        </div>
        {this.renderOpsModal()}
      </Layout>
    );
  }
}

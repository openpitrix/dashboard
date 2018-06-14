import React, { Component, Fragment } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { pick, assign } from 'lodash';

import { Icon, Button, Input, Table, Pagination, Popover, Modal } from 'components/Base';
import AppCard from 'components/DetailCard/AppCard';
import VersionList from 'components/VersionList';
import TagNav from 'components/TagNav';
import Layout, { BackBtn, Dialog } from 'components/Layout/Admin';
import columns from './columns';

import { getSessInfo } from 'utils';

import styles from './index.scss';

@inject(({ rootStore, sessInfo }) =>
  assign(pick(rootStore, ['appStore', 'clusterStore', 'appVersionStore']), sessInfo)
)
@observer
export default class AppDetail extends Component {
  static async onEnter({ appStore, clusterStore, appVersionStore }, { appId }) {
    await appStore.fetch(appId);
    await appVersionStore.fetchAll({ app_id: appId });
    await clusterStore.fetchAll({ app_id: appId });
  }

  constructor(props) {
    super(props);
    this.appId = props.match.params.appId;
    this.loginUser = getSessInfo('user', props.sessInfo);
  }

  renderHandleMenu = appId => {
    const { showCreateVersion } = this.props.appVersionStore;

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/app/${appId}/deploy`}>Deploy App</Link>
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
    let modalTitle = '',
      modalBody = null,
      onSubmit = () => {},
      resetProps = {};

    if (handleVersion.action === 'create') {
      modalTitle = 'Create App Version';
      onSubmit = this.handleCreateVersion.bind(this);
      modalBody = (
        <Fragment>
          <div className={styles.inputItem}>
            <label className={styles.name}>Name</label>
            <Input className={styles.input} name="name" required />
          </div>
          <div className={styles.inputItem}>
            <label className={styles.name}>Package Name</label>
            <Input
              className={styles.input}
              name="package_name"
              required
              placeholder="http://openpitrix.pek3a.qingstor.com/package/zk-0.1.0.tgz"
            />
          </div>
          <div className={styles.inputItem}>
            <label className={classNames(styles.name, styles.textareaName)}>Description</label>
            <textarea className={styles.textarea} name="description" />
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

  handlePagination = page => {};

  render() {
    const { appStore, clusterStore, appVersionStore } = this.props;
    const appDetail = toJS(appStore.appDetail);
    const versions = toJS(appVersionStore.versions);

    const data = toJS(clusterStore.clusters);

    const { showAllVersions } = this.props.appVersionStore;
    const { fetchQueryClusters } = this.props.clusterStore;

    const { notifyMsg, hideMsg } = this.props.appVersionStore;

    return (
      <Layout className={styles.appDetail} msg={notifyMsg} hideMsg={hideMsg}>
        <BackBtn label="apps" link="/dashboard/apps" />
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <div className={styles.detailOuter}>
              <AppCard appDetail={appDetail} />
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
            <div className={styles.wrapper2}>
              <TagNav tags={[{ id: 1, name: 'Clusters' }]} curTag="Clusters" />

              <div className={styles.toolbar}>
                <Input.Search
                  className={styles.search}
                  placeholder="Search & Filter"
                  onSearch={fetchQueryClusters}
                />
                <Button className={styles.buttonRight} onClick={clusterStore.fetchAll}>
                  <Icon name="refresh" />
                </Button>
              </div>

              <Table columns={columns} dataSource={data} />
            </div>
            <Pagination onChange={this.handlePagination} total={clusterStore.totalCount} />
          </div>
        </div>
        {this.renderOpsModal()}
      </Layout>
    );
  }
}

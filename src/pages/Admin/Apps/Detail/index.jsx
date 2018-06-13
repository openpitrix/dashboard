import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { pick } from 'lodash';

import { Icon, Button, Input, Table, Pagination, Popover, Modal } from 'components/Base';
import AppCard from 'components/DetailCard/AppCard';
import VersionList from 'components/VersionList';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import TdName from 'components/TdName';

import { getParseDate } from 'utils';
import Layout, { BackBtn } from 'pages/Layout/Admin';

import styles from './index.scss';

@inject(({ rootStore }) => pick(rootStore, ['appStore', 'clusterStore', 'appVersionStore']))
@observer
export default class AppDetail extends Component {
  static async onEnter({ appStore, clusterStore, appVersionStore }, { appId }) {
    await appStore.fetch(appId);
    await appVersionStore.fetchAll(appId);
    await clusterStore.fetchAll();
  }

  renderHandleMenu = () => {
    const { showModal } = this.props.appVersionStore;

    return (
      <div className="operate-menu">
        <span onClick={showModal}>Create version</span>
      </div>
    );
  };

  createVersionModal = () => {
    const {
      isModalOpen,
      hideModal,
      createVersionSubmit,
      changeName,
      changePackageName,
      changeDescription
    } = this.props.appVersionStore;

    const appDetail = toJS(this.props.appStore.appDetail);

    return (
      <Modal
        width={500}
        title="Create App Version"
        visible={isModalOpen}
        hideFooter
        onCancel={hideModal}
      >
        <div className={styles.modalContent}>
          <div className={styles.inputItem}>
            <label className={styles.name}>Name</label>
            <Input className={styles.input} name="name" required onChange={changeName} />
          </div>
          <div className={styles.inputItem}>
            <label className={styles.name}>Package Name</label>
            <Input
              className={styles.input}
              name="package_name"
              required
              onChange={changePackageName}
              placeholder="http://openpitrix.pek3a.qingstor.com/package/zk-0.1.0.tgz"
            />
          </div>
          <div className={styles.inputItem}>
            <label className={classNames(styles.name, styles.textareaName)}>Description</label>
            <textarea
              className={styles.textarea}
              name="description"
              required
              onChange={changeDescription}
            />
          </div>
          <div className={styles.operation}>
            <Button type="default" onClick={hideModal}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                createVersionSubmit(appDetail.app_id, this.props.appStore);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  deleteVersionModal = () => {
    const { showDeleteVersion, hideModal, deleteVersionSubmit } = this.props.appVersionStore;

    return (
      <Modal
        width={500}
        title="Delete Version"
        visible={showDeleteVersion}
        hideFooter
        onCancel={hideModal}
      >
        <div className={styles.modalContent}>
          <div className={styles.noteWord}>Are you sure delete this Version?</div>
          <div className={styles.operation}>
            <Button type="default" onClick={hideModal}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                deleteVersionSubmit(this.props.appStore);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  allVersionModal = () => {
    const { showAllVersion, hideModal, remove } = this.props.appVersionStore;
    const versions = toJS(this.props.appVersionStore.versions);

    return (
      <Modal
        width={500}
        title="All Versions"
        visible={showAllVersion}
        hideFooter
        onCancel={hideModal}
      >
        <div className={styles.modalContent}>
          <VersionList versions={versions} deleteVersion={remove} />
        </div>
      </Modal>
    );
  };

  render() {
    const { appStore, clusterStore, appVersionStore } = this.props;
    const appDetail = toJS(appStore.appDetail);
    const versions = toJS(appVersionStore.versions);

    const fetchClusters = async current => {
      await clusterStore.fetchAll(current);
    };
    const data = toJS(clusterStore.clusters);

    const columns = [
      {
        title: 'Cluster Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, obj) => <TdName name={name} description={obj.description} />
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'App Version',
        dataIndex: 'version_id',
        key: 'version_id',
        width: '100px'
      },
      {
        title: 'Node Count',
        dataIndex: 'cluster_node_set',
        key: 'cluster_node_set',
        render: nodeSet => <div>{nodeSet && nodeSet.length}</div>
      },
      {
        title: 'Runtime',
        dataIndex: 'runtime_id',
        key: 'runtime_id',
        width: '100px'
      },
      {
        title: 'User',
        dataIndex: 'owner',
        key: 'owner'
      },
      {
        title: 'Date Created',
        dataIndex: 'create_time',
        key: 'create_time',
        render: getParseDate
      }
    ];
    const tags = [{ id: 1, name: 'Clusters' }];
    const curTag = 'Clusters';
    const { remove, showModal } = this.props.appVersionStore;
    const { fetchQueryClusters } = this.props.clusterStore;

    return (
      <Layout className={styles.appDetail}>
        <BackBtn label="apps" link="/dashboard/apps" />
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <div className={styles.detailOuter}>
              <AppCard appDetail={appDetail} />
              <Popover className={styles.operation} content={this.renderHandleMenu()}>
                <Icon name="more" />
              </Popover>
            </div>
            <div className={styles.versionOuter}>
              <div className={styles.title}>
                Versions
                <div className={styles.all} onClick={showModal}>
                  All Versions →
                </div>
              </div>
              <VersionList versions={versions.slice(0, 4)} deleteVersion={remove} />
            </div>
          </div>
          <div className={styles.rightInfo}>
            <div className={styles.wrapper2}>
              <TagNav tags={tags} curTag={curTag} />
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
            {clusterStore.totalCount > 0 && (
              <Pagination onChange={fetchClusters} total={clusterStore.totalCount} />
            )}
          </div>
        </div>
        {this.deleteVersionModal()}
        {this.createVersionModal()}
        {this.allVersionModal()}
      </Layout>
    );
  }
}

import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import ManageTabs from 'components/ManageTabs';
import AppCard from 'components/DetailCard/AppCard';
import VersionList from 'components/VersionList';
import Icon from 'components/Base/Icon';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import Table from 'components/Base/Table';
import Form from 'components/Base/Form';
import Pagination from 'components/Base/Pagination';
import TdName from 'components/TdName';
import Popover from 'components/Base/Popover';
import Modal from 'components/Base/Modal';
import { getParseDate } from 'utils';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  clusterStore: rootStore.clusterStore,
  appHandleStore: rootStore.appHandleStore
}))
@observer
export default class AppDetail extends Component {
  static async onEnter({ appStore, clusterStore }, { appId }) {
    await appStore.fetchApp(appId);
    await appStore.fetchAppVersions(appId);
    await clusterStore.fetchClusters({ page: 1 });
    this.props.appHandleStore.appId = appId;
  }

  renderHandleMenu = () => {
    const { createVersionShow } = this.props.appHandleStore;
    return (
      <div className="operate-menu">
        <span onClick={createVersionShow}>Create version</span>
      </div>
    );
  };

  createVersionModal = () => {
    const { showCreateVersion, createVersionClose } = this.props.appHandleStore;
    const { createVersion } = this.props.appStore;
    return (
      <Modal
        width={500}
        title="Create App Version"
        visible={showCreateVersion}
        hideFooter
        onCancel={createVersionClose}
      >
        <div className={styles.modalContent}>
          <Form onSubmit={createVersion}>
            <Form.Item label="Name" className={styles.inputItem}>
              <Input name="name" />
            </Form.Item>
            <Form.Item label="Description" className={styles.inputItem}>
              <Input name="description" />
            </Form.Item>
            <Form.Item label="Package Name" className={styles.inputItem}>
              <Input name="packageName" />
            </Form.Item>
            <Form.Item label="Sequence" className={styles.inputItem}>
              <Input name="sequence" />
            </Form.Item>
          </Form>
          <div className={styles.operation}>
            <Button type="default" onClick={createVersionClose}>
              Cancel
            </Button>
            <Button htmlType="submit">Confirm</Button>
          </div>
        </div>
      </Modal>
    );
  };

  deleteVersionModal = () => {
    const {
      showDeleteVersion,
      deleteVersionClose,
      deleteVersion,
      createVersionSubmit
    } = this.props.appHandleStore;

    return (
      <Modal
        width={500}
        title="Delete Version"
        visible={showDeleteVersion}
        hideFooter
        onCancel={deleteVersionClose}
      >
        <div className={styles.modalContent}>
          <div className={styles.noteWord}>Are you sure delete this Version?</div>
          <div className={styles.operation}>
            <Button type="default" onClick={deleteVersion}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                createVersionSubmit(this.props.appStore);
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
    const { showAllVersion, allVersionClose } = this.props.appHandleStore;
    return (
      <Modal
        width={500}
        title="Delete APP"
        visible={showAllVersion}
        hideFooter
        onCancel={allVersionClose}
      >
        <div className={styles.modalContent}>
          <div className={styles.noteWord}>Are you sure delete this Version?</div>
          <div className={styles.operation}>
            <Button type="default" onClick={allVersionClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                allVersionClose();
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  onSearch = async name => {
    await this.props.clusterStore.fetchQueryClusters(name);
  };

  onRefresh = async () => {
    await this.onSearch();
  };

  render() {
    const { appStore, clusterStore } = this.props;
    const appDetail = toJS(appStore.app);
    const versions = toJS(appStore.versions);
    const fetchClusters = async current => {
      await clusterStore.fetchClusters({ page: current });
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
        dataIndex: 'latest_version',
        key: 'latest_version'
      },
      {
        title: 'Node Count',
        dataIndex: 'node_count',
        key: 'id'
      },
      {
        title: 'Runtime',
        dataIndex: 'runtime',
        key: 'runtime'
      },
      {
        title: 'User',
        dataIndex: 'user',
        key: 'user'
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

    return (
      <div className={styles.appDetail}>
        <ManageTabs />
        <div className={styles.backTo}>
          <Link to="/manage/apps">← Back to Apps</Link>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <div className={styles.mb24}>
              <AppCard appDetail={appDetail} />
              <Popover className={styles.operation} content={this.renderHandleMenu()}>
                <Icon name="more" />
              </Popover>
            </div>
            <VersionList versions={versions.slice(0, 4)} />
          </div>
          <div className={styles.rightInfo}>
            <div className={styles.wrapper2}>
              <TagNav tags={tags} curTag={curTag} />
              <div className={styles.toolbar}>
                <Input.Search
                  className={styles.search}
                  placeholder="Search & Filter"
                  onSearch={this.onSearch}
                />
                <Button className={styles.buttonRight} onClick={this.onRefresh}>
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
      </div>
    );
  }
}

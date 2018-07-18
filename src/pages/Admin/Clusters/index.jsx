import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import { Icon, Input, Button, Table, Pagination, Popover, Modal } from 'components/Base';
import Status from 'components/Status';
import TdName from 'components/TdName';
import Statistics from 'components/Statistics';
import Layout, { Dialog } from 'components/Layout/Admin';
import { formatTime, getObjName } from 'utils';

import styles from './index.scss';
import capitalize from 'lodash/capitalize';

@inject(({ rootStore, sock }) => ({
  rootStore,
  clusterStore: rootStore.clusterStore,
  appStore: rootStore.appStore,
  runtimeStore: rootStore.runtimeStore,
  sock
}))
@observer
export default class Clusters extends Component {
  static async onEnter({ clusterStore, appStore, runtimeStore }) {
    clusterStore.loadPageInit();
    await clusterStore.fetchAll();
    await clusterStore.clusterStatistics();
    await appStore.fetchAll({ status: ['active', 'deleted'] });
    await runtimeStore.fetchAll({ status: ['active', 'deleted'] });
  }

  constructor(props) {
    super(props);
    this.store = this.props.clusterStore;

    if (!props.sock._events['ops-resource']) {
      props.sock.on('ops-resource', this.listenToJob);
    }
  }

  listenToJob = payload => {
    const { rootStore } = this.props;

    if (['cluster'].includes(get(payload, 'resource.rtype'))) {
      rootStore.sockMessage = JSON.stringify(payload);
    }
  };

  renderHandleMenu = item => {
    const { showOperateCluster } = this.props.clusterStore;
    const { cluster_id, status } = item;

    return (
      <div id={cluster_id} className="operate-menu">
        <Link to={`/dashboard/cluster/${cluster_id}`}>View detail</Link>
        <span onClick={() => showOperateCluster(cluster_id, 'delete')}>Delete cluster</span>
        {status === 'stopped' && (
          <span onClick={() => showOperateCluster(cluster_id, 'start')}>Start cluster</span>
        )}
        {status === 'active' && (
          <span onClick={() => showOperateCluster(cluster_id, 'stop')}>Stop cluster</span>
        )}
      </div>
    );
  };

  handleCluster = () => {
    const { clusterId, clusterIds, modalType, operateType } = this.store;
    let ids = operateType === 'multiple' ? clusterIds.toJSON() : [clusterId];
    switch (modalType) {
      case 'delete':
        this.store.remove(ids);
        break;
      case 'start':
        this.store.start(ids);
        break;
      case 'stop':
        this.store.stop(ids);
        break;
    }
  };

  oprateSelected = type => {
    const { showOperateCluster, clusterIds } = this.props.clusterStore;
    showOperateCluster(clusterIds, type);
  };

  renderDeleteModal = () => {
    const { hideModal, isModalOpen, modalType } = this.store;

    return (
      <Dialog
        title={`${capitalize(modalType)} Cluster`}
        isOpen={isModalOpen}
        onCancel={hideModal}
        onSubmit={this.handleCluster}
      >
        <div className={styles.noteWord}>{`Are you sure ${modalType} this Cluster?`}</div>
      </Dialog>
    );
  };

  render() {
    const {
      summaryInfo,
      clusters,
      totalCount,
      notifyMsg,
      hideMsg,
      isLoading,
      currentPage,
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      changePagination,
      clusterIds,
      selectedRowKeys,
      onChangeSelect,
      onChangeStatus,
      selectStatus
    } = this.props.clusterStore;
    const { runtimes } = this.props.runtimeStore;
    const { apps } = this.props.appStore;

    const columns = [
      {
        title: 'Cluster Name',
        key: 'name',
        render: cl => (
          <TdName
            name={cl.name}
            description={cl.cluster_id}
            linkUrl={`/dashboard/cluster/${cl.cluster_id}`}
          />
        )
      },
      {
        title: 'Status',
        key: 'status',
        render: cl => <Status type={cl.status} name={cl.status} />
      },
      {
        title: 'App',
        key: 'app_id',
        render: cl => (
          <Link to={`/dashboard/app/${cl.app_id}`}>
            {getObjName(apps, 'app_id', cl.app_id, 'name')}
          </Link>
        )
      },
      {
        title: 'Runtime',
        key: 'runtime_id',
        render: cl => (
          <Link to={`/dashboard/runtime/${cl.runtime_id}`}>
            {getObjName(runtimes, 'runtime_id', cl.runtime_id, 'name')}
          </Link>
        )
      },
      {
        title: 'Node Count',
        key: 'node_count',
        render: cl => cl.cluster_node_set && cl.cluster_node_set.length
      },
      {
        title: 'User',
        key: 'owner',
        render: cl => cl.owner
      },
      {
        title: 'Updated At',
        key: 'status_time',
        render: cl => formatTime(cl.status_time, 'YYYY/MM/DD HH:mm:ss')
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (text, cl) => (
          <div className={styles.handlePop}>
            <Popover content={this.renderHandleMenu(cl)}>
              <Icon name="more" />
            </Popover>
          </div>
        )
      }
    ];

    const rowSelection = {
      type: 'checkbox',
      selectType: 'onSelect',
      selectedRowKeys: selectedRowKeys,
      onChange: onChangeSelect
    };

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
        onChangeFilter: onChangeStatus,
        selectValue: selectStatus
      }
    ];

    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg}>
        <Statistics {...summaryInfo} objs={runtimes.slice()} />
        <div className={styles.container}>
          <div className={styles.wrapper}>
            {clusterIds.length > 0 && (
              <div className={styles.toolbar}>
                <Button
                  type="primary"
                  className={styles.delete}
                  onClick={() => this.oprateSelected('delete')}
                >
                  Delete
                </Button>
                <Button
                  type="primary"
                  className={styles.start}
                  onClick={() => this.oprateSelected('start')}
                >
                  Start
                </Button>
                <Button
                  type="primary"
                  className={styles.stop}
                  onClick={() => this.oprateSelected('stop')}
                >
                  Stop
                </Button>
              </div>
            )}
            {clusterIds.length === 0 && (
              <div className={styles.toolbar}>
                <Input.Search
                  className={styles.search}
                  placeholder="Search Cluster"
                  value={searchWord}
                  onSearch={onSearch}
                  onClear={onClearSearch}
                  maxLength="50"
                />
                <Button className={'refresh-btn'} onClick={onRefresh}>
                  <Icon name="refresh" />
                </Button>
              </div>
            )}
            <Table
              className={styles.tableOuter}
              columns={columns}
              dataSource={clusters.toJSON()}
              rowSelection={rowSelection}
              isLoading={isLoading}
              filterList={filterList}
            />
          </div>
          <Pagination onChange={changePagination} total={totalCount} current={currentPage} />
        </div>
        {this.renderDeleteModal()}
      </Layout>
    );
  }
}

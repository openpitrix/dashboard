import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import { Link } from 'react-router-dom';

import { Icon, Input, Button, Table, Pagination, Popover, Modal } from 'components/Base';
import Status from 'components/Status';
import TdName from 'components/TdName';
import Statistics from 'components/Statistics';
import Layout, { Dialog } from 'components/Layout/Admin';
import { getParseDate, getParseTime } from 'utils';

import styles from './index.scss';
import capitalize from 'lodash/capitalize';
import classNames from 'classnames';

@inject(({ rootStore }) => ({
  clusterStore: rootStore.clusterStore
}))
@observer
export default class Clusters extends Component {
  static async onEnter({ clusterStore }) {
    clusterStore.loadPageInit();
    await clusterStore.fetchAll();
  }

  constructor(props) {
    super(props);
    this.store = this.props.clusterStore;
  }

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
      cancelSelected
    } = this.props.clusterStore;
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
        render: cl => cl.app_id
      },
      {
        title: 'Runtime',
        key: 'runtime_id',
        render: cl => cl.runtime_id
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
        render: cl => (
          <Fragment>
            <div>{getParseDate(cl.status_time)}</div>
            <div>{getParseTime(cl.status_time)}</div>
          </Fragment>
        )
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

    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg} isLoading={isLoading}>
        <Statistics {...summaryInfo} />
        <div className={styles.container}>
          <div className={styles.wrapper}>
            {clusterIds.length > 0 && (
              <div className={styles.toolbar}>
                <Button
                  type="primary"
                  className={styles.operation}
                  onClick={() => this.oprateSelected('delete')}
                >
                  <Icon name="check" />Delete
                </Button>
                <Button
                  type="primary"
                  className={styles.operation}
                  onClick={() => this.oprateSelected('start')}
                >
                  <Icon name="check" />Start
                </Button>
                <Button
                  type="primary"
                  className={styles.operation}
                  onClick={() => this.oprateSelected('stop')}
                >
                  <Icon name="check" />Stop
                </Button>
                <Button
                  className={classNames(styles.operation, styles.buttonRight)}
                  onClick={cancelSelected}
                >
                  <Icon name="refresh" /> Cancel Selected
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
                />
                <Button className={styles.buttonRight} onClick={onRefresh}>
                  <Icon name="refresh" />
                </Button>
              </div>
            )}
            <Table
              className={styles.tableOuter}
              columns={columns}
              dataSource={clusters.toJSON()}
              rowSelection={rowSelection}
            />
          </div>
          <Pagination onChange={changePagination} total={totalCount} current={currentPage} />
        </div>
        {this.renderDeleteModal()}
      </Layout>
    );
  }
}

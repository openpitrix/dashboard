import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { formatTime } from 'utils';
import classNames from 'classnames';

import { Icon, Button, Input, Popover, Table, Pagination } from 'components/Base';
import Status from 'components/Status';
import TdName, { ProviderName } from 'components/TdName';
import Statistics from 'components/Statistics';
import Layout, { Dialog } from 'components/Layout/Admin';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore,
  clusterStore: rootStore.clusterStore
}))
@observer
export default class Runtimes extends Component {
  static async onEnter({ runtimeStore, clusterStore }) {
    runtimeStore.loadPageInit();
    await runtimeStore.fetchAll();
    await runtimeStore.runtimeStatistics();
    await clusterStore.fetchAll({
      status: ['active', 'stopped', 'ceased', 'pending', 'suspended', 'deleted']
    });
  }

  renderHandleMenu = id => {
    const { runtimeStore } = this.props;
    const { showDeleteRuntime } = runtimeStore;

    return (
      <div id={id} className="operate-menu">
        <Link to={`/dashboard/runtime/${id}`}>View runtime detail</Link>
        <Link to={`/dashboard/runtime/edit/${id}`}>Modify runtime</Link>
        <span onClick={() => showDeleteRuntime(id)}>Delete runtime</span>
      </div>
    );
  };

  renderDeleteModal = () => {
    const { runtimeStore } = this.props;
    const { isModalOpen, hideModal, remove } = runtimeStore;

    return (
      <Dialog title="Delete Runtime" isOpen={isModalOpen} onSubmit={remove} onCancel={hideModal}>
        Are you sure delete this Runtime?
      </Dialog>
    );
  };

  render() {
    const { runtimeStore, clusterStore } = this.props;
    const data = runtimeStore.runtimes.toJSON();
    const clusters = clusterStore.clusters.toJSON();
    const {
      summaryInfo,
      isLoading,
      notifyMsg,
      hideMsg,
      searchWord,
      currentPage,
      totalCount,
      onSearch,
      onClearSearch,
      onRefresh,
      changePagination,
      showDeleteRuntime,
      runtimeIds,
      selectedRowKeys,
      onChangeSelect,
      onChangeStatus,
      selectStatus
    } = runtimeStore;

    const columns = [
      {
        title: 'Runtime Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, obj) => (
          <TdName
            name={name}
            description={obj.runtime_id}
            linkUrl={`/dashboard/runtime/${obj.runtime_id}`}
          />
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Provider',
        key: 'provider',
        render: item => <ProviderName name={item.provider} provider={item.provider} />
      },
      {
        title: ' Zone/Namespace',
        dataIndex: 'zone',
        key: 'zone'
      },
      {
        title: 'Cluster Count',
        key: 'node_count',
        render: runtime =>
          clusters.filter(cluster => runtime.runtime_id === cluster.runtime_id).length
      },
      {
        title: 'User',
        dataIndex: 'owner',
        key: 'owner'
      },
      {
        title: 'Updated At',
        key: 'status_time',
        render: runtime => formatTime(runtime.status_time, 'YYYY/MM/DD HH:mm:ss')
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        width: '80px',
        render: (text, item) => (
          <div className={styles.handlePop}>
            <Popover content={this.renderHandleMenu(item.runtime_id)}>
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
        conditions: [{ name: 'Active', value: 'active' }, { name: 'Deleted', value: 'deleted' }],
        onChangeFilter: onChangeStatus,
        selectValue: selectStatus
      }
    ];

    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg}>
        <Statistics {...summaryInfo} />

        <div className="table-outer">
          {runtimeIds.length > 0 && (
            <div className="toolbar">
              <Button type="delete" onClick={() => showDeleteRuntime(runtimeIds)}>
                Delete
              </Button>
            </div>
          )}
          {runtimeIds.length === 0 && (
            <div className="toolbar">
              <Input.Search
                placeholder="Search Runtimes Name"
                value={searchWord}
                onSearch={onSearch}
                onClear={onClearSearch}
                maxLength="50"
              />
              <Link to={`/dashboard/runtime/create`}>
                <Button className="f-right" type="primary">
                  Create
                </Button>
              </Link>
              <Button className="f-right" onClick={onRefresh}>
                <Icon name="refresh" size="mini" />
              </Button>
            </div>
          )}

          <Table
            columns={columns}
            dataSource={data}
            rowSelection={rowSelection}
            isLoading={isLoading}
            filterList={filterList}
          />
          <Pagination onChange={changePagination} total={totalCount} current={currentPage} />
        </div>
        {this.renderDeleteModal()}
      </Layout>
    );
  }
}

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { getParseDate, getParseTime } from 'utils';
import classNames from 'classnames';

import { Icon, Button, Input, Popover, Table, Pagination, Modal } from 'components/Base';
import Status from 'components/Status';
import TdName from 'components/TdName';
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
      <Dialog title="Delete Runtime" onCancel={hideModal} isOpen={isModalOpen} onSubmit={remove}>
        <div className={styles.noteWord}>Are you sure delete this Runtime?</div>
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
      onChangeSelect
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
        dataIndex: 'provider',
        key: 'provider'
      },
      {
        title: 'Zone',
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
        render: runtime => (
          <Fragment>
            <div>{getParseDate(runtime.status_time)}</div>
            <div>{getParseTime(runtime.status_time)}</div>
          </Fragment>
        )
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

    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg}>
        <Statistics {...summaryInfo} />
        <div className={styles.wrapper}>
          {runtimeIds.length > 0 && (
            <div className={styles.toolbar}>
              <Button
                type="primary"
                className={styles.delete}
                onClick={() => showDeleteRuntime(runtimeIds)}
              >
                Delete
              </Button>
            </div>
          )}
          {runtimeIds.length === 0 && (
            <div className={styles.toolbar}>
              <Input.Search
                className={styles.search}
                placeholder="Search Runtimes Name"
                value={searchWord}
                onSearch={onSearch}
                onClear={onClearSearch}
                maxlength="50"
              />
              <Link to={`/dashboard/runtime/create`}>
                <Button className={classNames(styles.buttonRight, styles.ml12)} type="primary">
                  Create
                </Button>
              </Link>
              <Button className={styles.buttonRight} onClick={onRefresh}>
                <Icon name="refresh" />
              </Button>
            </div>
          )}

          <Table
            className={styles.tableOuter}
            columns={columns}
            dataSource={data}
            rowSelection={rowSelection}
            isLoading={isLoading}
          />
        </div>

        <Pagination onChange={changePagination} total={totalCount} current={currentPage} />
        {this.renderDeleteModal()}
      </Layout>
    );
  }
}

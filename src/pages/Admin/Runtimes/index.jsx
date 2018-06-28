import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { getParseDate } from 'utils';
import classNames from 'classnames';

import { Icon, Button, Input, Popover, Table, Pagination, Modal } from 'components/Base';
import Status from 'components/Status';
import TdName from 'components/TdName';
import Statistics from 'components/Statistics';
import Layout, { Dialog } from 'components/Layout/Admin';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore
}))
@observer
export default class Runtimes extends Component {
  static async onEnter({ runtimeStore }) {
    runtimeStore.currentPage = 1;
    runtimeStore.searchWord = '';
    await runtimeStore.fetchAll();
  }

  renderHandleMenu = (id, status) => {
    const { runtimeStore } = this.props;
    const { showDeleteRuntime } = runtimeStore;

    return (
      <div id={id} className="operate-menu">
        <Link to={`/dashboard/runtime/${id}`}>View runtime detail</Link>
        {status !== 'deleted' && (
          <Fragment>
            <Link to={`/dashboard/runtime/edit/${id}`}>Modify runtime</Link>
            <span onClick={() => showDeleteRuntime(id)}>Delete runtime</span>
          </Fragment>
        )}
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
    const { runtimeStore } = this.props;
    const data = toJS(runtimeStore.runtimes);
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
      changePagination
    } = runtimeStore;

    const columns = [
      {
        title: 'Runtime Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, obj) => (
          <TdName
            name={name}
            description={obj.description}
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
        title: 'Zone/Namspace',
        dataIndex: 'zone',
        key: 'zone'
      },
      {
        title: 'Cluster Count',
        dataIndex: 'node_count',
        key: 'node_count'
      },
      {
        title: 'User',
        dataIndex: 'owner',
        key: 'owner'
      },
      {
        title: 'Updated At',
        dataIndex: 'status_time',
        key: 'status_time',
        width: '10%',
        render: getParseDate
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        width: '80px',
        render: (text, item) => (
          <div className={styles.handlePop}>
            <Popover content={this.renderHandleMenu(item.runtime_id, item.status)}>
              <Icon name="more" />
            </Popover>
          </div>
        )
      }
    ];

    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg} isLoading={isLoading}>
        <Statistics {...summaryInfo} />
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.toolbar}>
              <Input.Search
                className={styles.search}
                placeholder="Search Runtimes Name"
                value={searchWord}
                onSearch={onSearch}
                onClear={onClearSearch}
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

            <Table className={styles.tableOuter} columns={columns} dataSource={data} />
          </div>
          {totalCount > 0 && (
            <Pagination onChange={changePagination} total={totalCount} current={currentPage} />
          )}
        </div>
        {this.renderDeleteModal()}
      </Layout>
    );
  }
}

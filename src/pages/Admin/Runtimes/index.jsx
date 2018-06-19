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
            <span onClick={showDeleteRuntime.bind(runtimeStore, id)}>Delete runtime</span>
          </Fragment>
        )}
      </div>
    );
  };

  renderDeleteModal = () => {
    const { runtimeStore } = this.props;
    const { isModalOpen, hideModal, remove } = runtimeStore;

    return (
      <Dialog
        title="Delete Runtime"
        onCancel={hideModal}
        isOpen={isModalOpen}
        onSubmit={remove.bind(runtimeStore, null)}
      >
        <div className={styles.noteWord}>Are you sure delete this Runtime?</div>
      </Dialog>
    );
  };

  onRefresh = () => {
    const { currentPage, fetchAll } = this.props.runtimeStore;
    fetchAll({ page: currentPage });
  };

  onSearch = search_word => {
    const { fetchAll, changeSearchWord } = this.props.runtimeStore;
    fetchAll({ search_word });
    changeSearchWord(search_word);
  };

  onClearSearch = () => {
    this.onSearch('');
  };

  render() {
    const {
      runtimes,
      isLoading,
      statistics,
      changePagination,
      totalCount,
      currentPage,
      searchWord,
      notifyMsg,
      hideMsg
    } = this.props.runtimeStore;
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
      <Layout isLoading={isLoading} msg={notifyMsg} hideMsg={hideMsg}>
        <Statistics {...statistics} />
        <div className={styles.wrapper}>
          <div className={styles.toolbar}>
            <Input.Search
              className={styles.search}
              placeholder="Search Runtimes Name"
              onSearch={this.onSearch}
              onClear={this.onClearSearch}
              value={searchWord}
            />
            <Link to={`/dashboard/runtime/create`}>
              <Button className={classNames(styles.buttonRight, styles.ml12)} type="primary">
                Create
              </Button>
            </Link>
            <Button className={styles.buttonRight} onClick={this.onRefresh}>
              <Icon name="refresh" />
            </Button>
          </div>
          <Table className={styles.tableOuter} columns={columns} dataSource={runtimes.toJSON()} />
        </div>

        <Pagination onChange={changePagination} total={totalCount} current={currentPage} />
        {this.renderDeleteModal()}
      </Layout>
    );
  }
}

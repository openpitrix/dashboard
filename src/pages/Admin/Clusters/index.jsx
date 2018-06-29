import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Icon, Input, Button, Table, Pagination, Popover, Modal } from 'components/Base';
import Status from 'components/Status';
import TdName from 'components/TdName';
import Statistics from 'components/Statistics';
import Layout, { Dialog } from 'components/Layout/Admin';
import { getParseDate } from 'utils';

import styles from './index.scss';

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
    const { showDeleteCluster } = this.props.clusterStore;
    const { cluster_id, status } = item;

    return (
      <div id={cluster_id} className="operate-menu">
        <Link to={`/dashboard/cluster/${cluster_id}`}>View detail</Link>
        <span onClick={showDeleteCluster.bind(this.store, cluster_id)}>Delete cluster</span>
      </div>
    );
  };

  handleDeleteCluster = () => {
    this.store.remove();
  };

  renderDeleteModal = () => {
    const { hideModal, isModalOpen } = this.store;

    return (
      <Dialog
        title="Delete Cluster"
        isOpen={isModalOpen}
        onCancel={hideModal}
        onSubmit={this.handleDeleteCluster}
      >
        <div className={styles.noteWord}>Are you sure delete this Cluster?</div>
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
      changePagination
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
        key: 'upgrade_time',
        render: cl => getParseDate(cl.status_time)
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
    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg} isLoading={isLoading}>
        <Statistics {...summaryInfo} />
        <div className={styles.container}>
          <div className={styles.wrapper}>
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

            <Table className={styles.tableOuter} columns={columns} dataSource={clusters.toJSON()} />
          </div>
          <Pagination onChange={changePagination} total={totalCount} current={currentPage} />
        </div>
        {this.renderDeleteModal()}
      </Layout>
    );
  }
}

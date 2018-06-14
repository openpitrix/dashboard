import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

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
    await clusterStore.fetchAll();
    // await clusterStore.fetchStatistics();
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
        {status !== 'deleted' && (
          <span onClick={showDeleteCluster.bind(this.store, item)}>Delete cluster</span>
        )}
      </div>
    );
  };

  handleDeleteCluster = ev => {
    this.store.remove();
  };

  onSearch = search_word => {
    if (!search_word) {
      return false;
    }
    this.store.fetchAll({
      search_word: search_word
    });
  };

  onRefresh = ev => {
    this.store.fetchAll();
  };

  onChangePagination = page => {
    this.store.fetchAll({ page });
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
    const { summaryInfo, clusters, totalCount, notifyMsg, hideMsg, isLoading } = this.store;
    const columns = [
      {
        title: 'Cluster Name',
        key: 'name',
        render: cl => <TdName name={cl.name} description={cl.description} />
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
        render: cl => cl.cluster_node_set.length
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
                placeholder="Search Cluster Name or App"
                onSearch={this.onSearch}
              />
              {/*<Button className={classNames(styles.buttonRight, styles.ml12)} type="primary">*/}
              {/*Create*/}
              {/*</Button>*/}
              <Button className={styles.buttonRight} onClick={this.onRefresh}>
                <Icon name="refresh" />
              </Button>
            </div>

            <Table className={styles.tableOuter} columns={columns} dataSource={clusters.toJSON()} />
          </div>
          <Pagination onChange={this.onChangePagination} total={totalCount} />
        </div>
        {this.renderDeleteModal()}
      </Layout>
    );
  }
}

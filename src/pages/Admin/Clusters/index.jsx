import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Statistics from 'components/Statistics';
import Icon from 'components/Base/Icon';
import Input from 'components/Base/Input';
import Button from 'components/Base/Button';
import Status from 'components/Status';
import Table from 'components/Base/Table';
import Pagination from 'components/Base/Pagination';
import TdName from 'components/TdName';
import Popover from 'components/Base/Popover';
import Layout from 'pages/Layout/Admin';
import Modal from 'components/Base/Modal';

import { getParseDate } from 'utils';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  clusterStore: rootStore.clusterStore,
  clusterHandleStore: rootStore.clusterHandleStore
}))
@observer
export default class Clusters extends Component {
  static async onEnter({ clusterStore }) {
    await clusterStore.fetchClusters();
    await clusterStore.fetchStatistics();
  }

  renderHandleMenu = (id, status) => {
    const { deleteClusterShow } = this.props.clusterHandleStore;
    return (
      <div id={id} className="operate-menu">
        <Link to={`/dashboard/clusters/${id}`}>View cluster detail</Link>
        {status !== 'deleted' && (
          <span
            onClick={() => {
              deleteClusterShow(id);
            }}
          >
            Delete cluster
          </span>
        )}
      </div>
    );
  };

  deleteClusterModal = () => {
    const { showDeleteCluster, deleteClusterClose, deleteCluster } = this.props.clusterHandleStore;

    return (
      <Modal
        width={500}
        title="Delete Cluster"
        visible={showDeleteCluster}
        hideFooter
        onCancel={deleteClusterClose}
      >
        <div className={styles.modalContent}>
          <div className={styles.noteWord}>Are you sure delete this Cluster?</div>
          <div className={styles.operation}>
            <Button type="default" onClick={deleteClusterClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                deleteCluster(this.props.clusterStore);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  render() {
    const { clusterStore } = this.props;
    const data = toJS(clusterStore.clusters);
    const {
      image,
      name,
      total,
      centerName,
      progressTotal,
      progress,
      lastedTotal,
      histograms
    } = toJS(clusterStore.statistics);
    const columns = [
      {
        title: 'Cluster Name',
        dataIndex: 'name',
        key: 'id',
        render: (name, obj) => <TdName name={name} description={obj.description} />
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'App',
        dataIndex: 'app_id',
        key: 'app_id'
      },
      {
        title: 'Runtime',
        dataIndex: 'runtime_id',
        key: 'runtime_id'
      },
      {
        title: 'Node Count',
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
        dataIndex: 'upgrade_time',
        key: 'upgrade_time',
        render: getParseDate
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (text, item) => (
          <div className={styles.handlePop}>
            <Popover content={this.renderHandleMenu(item.cluster_id, item.status)}>
              <Icon name="more" />
            </Popover>
          </div>
        )
      }
    ];

    return (
      <Layout>
        <Statistics
          image={image}
          name={name}
          total={total}
          centerName={centerName}
          progressTotal={progressTotal}
          progress={progress}
          lastedTotal={lastedTotal}
          histograms={histograms}
        />
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.toolbar}>
              <Input.Search
                className={styles.search}
                placeholder="Search Cluster Name or App"
                onSearch={clusterStore.fetchQueryClusters}
              />
              {/*<Button className={classNames(styles.buttonRight, styles.ml12)} type="primary">*/}
              {/*Create*/}
              {/*</Button>*/}
              <Button className={styles.buttonRight} onClick={clusterStore.fetchClusters}>
                <Icon name="refresh" />
              </Button>
            </div>

            <Table className={styles.tableOuter} columns={columns} dataSource={data} />
          </div>
          {clusterStore.totalCount > 0 && (
            <Pagination onChange={clusterStore.fetchClusters} total={clusterStore.totalCount} />
          )}
        </div>
        {this.deleteClusterModal()}
      </Layout>
    );
  }
}

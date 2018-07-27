import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import { Icon, Button, Table, Pagination, Popover } from 'components/Base';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import Statistics from 'components/Statistics';
import Layout, { Dialog, Grid, Row, Section, Card } from 'components/Layout';
import { formatTime, getObjName } from 'utils';
import capitalize from 'lodash/capitalize';

import styles from './index.scss';

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
    await appStore.fetchApps({
      status: ['active', 'deleted']
    });
    await runtimeStore.fetchAll({
      status: ['active', 'deleted'],
      limit: 999
    });
  }

  constructor(props) {
    super(props);
    this.store = this.props.clusterStore;
    this.store.setSocketMessage();
  }

  listenToJob = async payload => {
    const { clusterStore } = this.props;
    const rtype = get(payload, 'resource.rtype');

    if (rtype === 'cluster') {
      await clusterStore.fetchAll();
      clusterStore.setSocketMessage(payload);
    }
  };

  getAppTdShow = (appId, apps) => {
    const app = apps.find(item => item.app_id === appId);

    return app ? (
      <TdName
        noCopy
        className="smallId"
        name={app.name}
        description={get(app, 'latest_app_version.name')}
        image={app.icon || 'appcenter'}
        linkUrl={`/dashboard/app/${appId}`}
      />
    ) : null;
  };
  renderHandleMenu = item => {
    const { showOperateCluster } = this.props.clusterStore;
    const { cluster_id, status } = item;

    return (
      <div id={cluster_id} className="operate-menu">
        <Link to={`/dashboard/cluster/${cluster_id}`}>View detail</Link>
        {status !== 'deleted' && (
          <span onClick={() => showOperateCluster(cluster_id, 'delete')}>Delete cluster</span>
        )}
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

  renderToolbar() {
    const { searchWord, onSearch, onClearSearch, onRefresh, clusterIds } = this.props.clusterStore;

    if (clusterIds.length) {
      return (
        <Toolbar>
          <Button
            type="delete"
            onClick={() => this.oprateSelected('delete')}
            className="btn-handle"
          >
            Delete
          </Button>
          <Button type="default" onClick={() => this.oprateSelected('start')}>
            Start
          </Button>
          <Button type="delete" onClick={() => this.oprateSelected('stop')}>
            Stop
          </Button>
        </Toolbar>
      );
    }

    return (
      <Toolbar
        placeholder="Search Cluster"
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
      />
    );
  }

  render() {
    const { clusterStore } = this.props;
    const { summaryInfo, clusters, notifyMsg, isLoading, sockMessage } = clusterStore;

    const { runtimes } = this.props.runtimeStore;
    const { apps } = this.props.appStore;

    const columns = [
      {
        title: 'Cluster Name',
        key: 'name',
        width: '155px',
        render: cl => (
          <TdName
            name={cl.name}
            description={cl.cluster_id}
            linkUrl={`/dashboard/cluster/${cl.cluster_id}`}
            noIcon
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
        width: '150px',
        render: cl => this.getAppTdShow(cl.app_id, apps.toJSON())
      },
      {
        title: 'Runtime',
        key: 'runtime_id',
        render: cl => (
          <Link to={`/dashboard/runtime/${cl.runtime_id}`}>
            <ProviderName
              name={getObjName(runtimes, 'runtime_id', cl.runtime_id, 'name')}
              provider={getObjName(runtimes, 'runtime_id', cl.runtime_id, 'provider')}
            />
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
        key: 'actions',
        width: '84px',
        render: (text, cl) => (
          <div className={styles.actions}>
            <Popover content={this.renderHandleMenu(cl)} className="actions">
              <Icon name="more" />
            </Popover>
          </div>
        )
      }
    ];

    const rowSelection = {
      type: 'checkbox',
      selectType: 'onSelect',
      selectedRowKeys: clusterStore.selectedRowKeys,
      onChange: clusterStore.onChangeSelect
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
        onChangeFilter: clusterStore.onChangeStatus,
        selectValue: clusterStore.selectStatus
      }
    ];

    const pagination = {
      tableType: 'Clusters',
      onChange: clusterStore.changePagination,
      total: clusterStore.totalCount,
      current: clusterStore.currentPage
    };

    return (
      <Layout msg={notifyMsg} listenToJob={this.listenToJob} sockMessage={sockMessage}>
        <Row>
          <Statistics {...summaryInfo} objs={runtimes.slice()} />
        </Row>

        <Row>
          <Grid>
            <Section size={12}>
              <Card>
                {this.renderToolbar()}
                <Table
                  columns={columns}
                  dataSource={clusters.toJSON()}
                  rowSelection={rowSelection}
                  isLoading={isLoading}
                  filterList={filterList}
                  pagination={pagination}
                />
              </Card>
              {this.renderDeleteModal()}
            </Section>
          </Grid>
        </Row>
      </Layout>
    );
  }
}

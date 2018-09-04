import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get, orderBy } from 'lodash';
import { translate } from 'react-i18next';

import { Icon, Button, Table, Pagination, Popover } from 'components/Base';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import Statistics from 'components/Statistics';
import Layout, { Dialog, Grid, Row, Section, Card } from 'components/Layout';
import { formatTime, getObjName } from 'utils';
import capitalize from 'lodash/capitalize';

import styles from './index.scss';

@translate()
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
    await clusterStore.fetchAll();
    await clusterStore.clusterStatistics();
    await appStore.fetchApps({
      status: ['active', 'deleted']
    });
    await runtimeStore.fetchAll({
      status: ['active', 'deleted'],
      limit: 99
    });
  }

  constructor(props) {
    super(props);
    const { clusterStore, runtimeStore } = this.props;
    clusterStore.loadPageInit();
    runtimeStore.loadPageInit();
    this.store = clusterStore;
  }

  listenToJob = async payload => {
    const { clusterStore } = this.props;
    // const rtype = get(payload, 'resource.rtype');
    //
    // if (rtype === 'cluster') {
    //   await clusterStore.fetchAll();
    //   clusterStore.setSocketMessage(payload);
    // }
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
    const { t } = this.props;
    const { showOperateCluster } = this.props.clusterStore;
    const { cluster_id, status } = item;

    return (
      <div id={cluster_id} className="operate-menu">
        <Link to={`/dashboard/cluster/${cluster_id}`}>{t('View detail')}</Link>
        {status === 'stopped' && (
          <span onClick={() => showOperateCluster(cluster_id, 'start')}>{t('Start cluster')}</span>
        )}
        {status === 'active' && (
          <span onClick={() => showOperateCluster(cluster_id, 'stop')}>{t('Stop cluster')}</span>
        )}
        {status !== 'deleted' && (
          <span onClick={() => showOperateCluster(cluster_id, 'delete')}>
            {t('Delete cluster')}
          </span>
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

  onChangeSort = (params = {}) => {
    const { clusterStore } = this.props;
    const order = params.reverse ? 'asc' : 'desc';
    clusterStore.clusters = orderBy(clusterStore.clusters, params.sort_key, order);
  };

  renderDeleteModal = () => {
    const { t } = this.props;
    const { hideModal, isModalOpen, modalType } = this.store;

    return (
      <Dialog
        title={t(`${capitalize(modalType)} cluster`)}
        isOpen={isModalOpen}
        onCancel={hideModal}
        onSubmit={this.handleCluster}
      >
        <div className={styles.noteWord}>
          {t('operate cluster desc', { operate: t(capitalize(modalType)) })}
        </div>
      </Dialog>
    );
  };

  renderToolbar() {
    const { t } = this.props;
    const { searchWord, onSearch, onClearSearch, onRefresh, clusterIds } = this.props.clusterStore;

    if (clusterIds.length) {
      return (
        <Toolbar>
          <Button
            type="delete"
            onClick={() => this.oprateSelected('delete')}
            className="btn-handle"
          >
            {t('Delete')}
          </Button>
          <Button type="default" onClick={() => this.oprateSelected('start')}>
            {t('Start')}
          </Button>
          <Button type="delete" onClick={() => this.oprateSelected('stop')}>
            {t('Stop')}
          </Button>
        </Toolbar>
      );
    }

    return (
      <Toolbar
        placeholder={t('Search Clusters')}
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
      />
    );
  }

  render() {
    const { clusterStore, t } = this.props;
    const { summaryInfo, clusters, isLoading } = clusterStore;

    const { runtimes } = this.props.runtimeStore;
    const { apps } = this.props.appStore;

    const columns = [
      {
        title: t('Cluster Name'),
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
        title: t('Status'),
        key: 'status',
        width: '102px',
        render: cl => <Status type={cl.status} name={cl.status} />
      },
      {
        title: t('App'),
        key: 'app_id',
        width: '150px',
        render: cl => this.getAppTdShow(cl.app_id, apps.toJSON())
      },
      {
        title: t('Runtime'),
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
        title: t('Node Count'),
        key: 'node_count',
        render: cl => (cl.cluster_node_set && cl.cluster_node_set.length) || 0
      },
      {
        title: t('User'),
        key: 'owner',
        render: cl => cl.owner
      },
      {
        title: t('Updated At'),
        key: 'status_time',
        width: '150px',
        sorter: true,
        onChangeSort: this.onChangeSort,
        render: cl => formatTime(cl.status_time, 'YYYY/MM/DD HH:mm:ss')
      },
      {
        title: t('Actions'),
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
          { name: t('Pending'), value: 'pending' },
          { name: t('Active'), value: 'active' },
          { name: t('Stopped'), value: 'stopped' },
          { name: t('Suspended'), value: 'suspended' },
          { name: t('Deleted'), value: 'deleted' },
          { name: t('Ceased'), value: 'ceased' }
        ],
        onChangeFilter: clusterStore.onChangeStatus,
        selectValue: clusterStore.selectStatus
      }
    ];

    const pagination = {
      tableType: 'Clusters',
      onChange: clusterStore.changePagination,
      total: clusterStore.totalCount,
      current: clusterStore.currentPage,
      noCancel: false
    };

    return (
      <Layout listenToJob={this.listenToJob}>
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

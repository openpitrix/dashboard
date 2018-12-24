import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import _, { capitalize } from 'lodash';
import { translate } from 'react-i18next';

import {
  Icon, Button, Table, Popover
} from 'components/Base';
import Layout, { Dialog, Row } from 'components/Layout';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import Statistics from 'components/Statistics';
import TimeShow from 'components/TimeShow';
import { getObjName } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  clusterStore: rootStore.clusterStore,
  appStore: rootStore.appStore,
  runtimeStore: rootStore.runtimeStore,
  userStore: rootStore.userStore,
  user: rootStore.user
}))
@observer
export default class Clusters extends Component {
  async componentDidMount() {
    const {
      clusterStore,
      appStore,
      runtimeStore,
      userStore,
      user
    } = this.props;

    const { isAdmin } = user;

    clusterStore.registerStore('app', appStore);

    await clusterStore.fetchAll();
    if (isAdmin) {
      await clusterStore.fetchStatistics();
      await userStore.fetchAll({ noLimit: true });
    }
    await runtimeStore.fetchAll({
      status: ['active', 'deleted'],
      noLimit: true,
      simpleQuery: true
    });
  }

  componentWillUnmount() {
    const { clusterStore } = this.props;
    clusterStore.reset();
  }

  listenToJob = async ({
    op, rtype, rid, values = {}
  }) => {
    const { clusterStore } = this.props;
    const { jobs } = clusterStore;
    const status = _.pick(values, ['status', 'transition_status']);
    // const logJobs = () => clusterStore.info(`${op}: ${rid}, ${JSON.stringify(status)}`);
    const clusterIds = clusterStore.clusters.map(cl => cl.cluster_id);

    if (op === 'create:job' && clusterIds.includes(values.cluster_id)) {
      // new job
      jobs[rid] = values.cluster_id;
    }

    // job updated
    if (op === 'update:job' && clusterIds.includes(jobs[rid])) {
      if (['successful', 'failed'].includes(status.status)) {
        delete jobs[rid];
        await clusterStore.fetchAll();
      }
    }

    if (rtype === 'cluster' && clusterIds.includes(rid)) {
      clusterStore.clusters = clusterStore.clusters.map(cl => {
        if (cl.cluster_id === rid) {
          Object.assign(cl, status);
        }
        return cl;
      });
    }
  };

  getDetailUrl = clusterId => {
    const { match } = this.props;
    const { appId } = match.params;
    let url = `/dashboard/cluster/${clusterId}`;
    if (appId) {
      const type = match.path.endsWith('sandbox-instances')
        ? `sandbox-instance`
        : 'customer-instance';
      url = `/dashboard/app/${appId}/${type}/${clusterId}`;
    }
    return url;
  };

  getAppTdShow = (appId, apps) => {
    const { isDev } = this.props.user;
    const app = apps.find(item => item.app_id === appId);

    return app ? (
      <TdName
        noCopy
        className="smallId"
        name={app.name}
        description={_.get(app, 'latest_app_version.name')}
        image={app.icon}
        linkUrl={isDev ? `/dashboard/app/${appId}` : `/store/${appId}`}
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
          <span onClick={() => showOperateCluster(cluster_id, 'start')}>
            {t('Start cluster')}
          </span>
        )}
        {status === 'active' && (
          <span onClick={() => showOperateCluster(cluster_id, 'stop')}>
            {t('Stop cluster')}
          </span>
        )}
        {status !== 'deleted' && (
          <span onClick={() => showOperateCluster(cluster_id, 'delete')}>
            {t('Delete')}
          </span>
        )}
      </div>
    );
  };

  handleCluster = () => {
    const {
      clusterId,
      clusterIds,
      modalType,
      operateType,
      remove,
      start,
      stop
    } = this.props.clusterStore;
    const ids = operateType === 'multiple' ? clusterIds.toJSON() : [clusterId];

    switch (modalType) {
      case 'delete':
        remove(ids);
        break;
      case 'start':
        start(ids);
        break;
      case 'stop':
        stop(ids);
        break;
      default:
        break;
    }
  };

  operateSelected = type => {
    const { showOperateCluster, clusterIds } = this.props.clusterStore;
    showOperateCluster(clusterIds, type);
  };

  onChangeSort = (params = {}) => {
    const { clusterStore } = this.props;
    const order = params.reverse ? 'asc' : 'desc';
    clusterStore.clusters = _.orderBy(
      clusterStore.clusters,
      params.sort_key,
      order
    );
  };

  renderDeleteModal = () => {
    const { t } = this.props;
    const { hideModal, isModalOpen, modalType } = this.props.clusterStore;

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
    const { t, match } = this.props;
    const { appId } = match.params;
    const {
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      clusterIds
    } = this.props.clusterStore;

    if (clusterIds.length) {
      return (
        <Toolbar noRefreshBtn noSearchBox>
          <Button type="default" onClick={() => this.operateSelected('start')}>
            <Icon name="start" size={20} type="dark" />
            {t('Start')}
          </Button>
          <Button type="default" onClick={() => this.operateSelected('stop')}>
            <Icon name="stop" size={20} type="dark" />
            {t('Stop')}
          </Button>
          <Button type="delete" onClick={() => this.operateSelected('delete')}>
            {t('Delete')}
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
        noRefreshBtn
      />
    );
  }

  render() {
    const {
      clusterStore, appStore, userStore, user, match, t
    } = this.props;
    const { summaryInfo, clusters, isLoading } = clusterStore;

    const runtimes = this.props.runtimeStore.allRuntimes;
    const { apps } = appStore;
    const { users } = userStore;

    let columns = [
      {
        title: t('Status'),
        key: 'status',
        width: '100px',
        render: cl => (
          <Status type={cl.status} transition={cl.transition_status} />
        )
      },
      {
        title: t('Instance Name ID'),
        key: 'name',
        width: '155px',
        render: cl => (
          <TdName
            name={cl.name}
            description={cl.cluster_id}
            linkUrl={this.getDetailUrl(cl.cluster_id)}
            noIcon
          />
        )
      },
      {
        title: t('Version'),
        key: 'app_id',
        width: '150px',
        render: cl => this.getAppTdShow(cl.app_id, apps.toJSON())
      },
      {
        title: t('Test Runtime'),
        key: 'runtime_id',
        width: '150px',
        render: cl => (
          <Link to={`/dashboard/runtime/${cl.runtime_id}`}>
            <ProviderName
              name={getObjName(runtimes, 'runtime_id', cl.runtime_id, 'name')}
              provider={getObjName(
                runtimes,
                'runtime_id',
                cl.runtime_id,
                'provider'
              )}
            />
          </Link>
        )
      },
      {
        title: t('Node Count'),
        key: 'node_count',
        width: '80px',
        render: cl => (cl.cluster_node_set && cl.cluster_node_set.length) || 0
      },
      {
        title: t('Creater'),
        key: 'owner',
        width: '100px',
        render: item => getObjName(users, 'user_id', item.owner, 'username') || item.owner
      },
      {
        title: t('Created At'),
        key: 'create_time',
        width: '80px',
        sorter: true,
        onChangeSort: this.onChangeSort,
        render: cl => <TimeShow time={cl.create_time} />
      },
      {
        title: '',
        key: 'actions',
        width: '70px',
        className: 'actions',
        render: cl => (
          <Popover content={this.renderHandleMenu(cl)} className="actions">
            <Icon name="more" />
          </Popover>
        )
      }
    ];

    if (!user.isAdmin) {
      columns = columns.filter(item => item.key !== 'owner');
    }

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

    const { isAdmin } = user;
    const pageTitle = match.path.endsWith('sandbox-instances')
      ? t('Sandbox-Instances')
      : t('Customer-Instances');

    return (
      <Layout listenToJob={this.listenToJob} pageTitle={pageTitle}>
        {isAdmin && (
          <Row>
            <Statistics {...summaryInfo} objs={runtimes.toJSON()} />
          </Row>
        )}

        <div>
          {this.renderToolbar()}
          <Table
            columns={columns}
            dataSource={clusters.toJSON()}
            rowSelection={rowSelection}
            isLoading={isLoading}
            filterList={filterList}
            pagination={pagination}
          />
        </div>

        {this.renderDeleteModal()}
      </Layout>
    );
  }
}

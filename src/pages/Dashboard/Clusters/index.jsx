import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import _, { capitalize } from 'lodash';
import { translate } from 'react-i18next';

import {
  Icon, Button, Table, Popover
} from 'components/Base';
import Layout, { Dialog } from 'components/Layout';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import TimeShow from 'components/TimeShow';
import { getObjName } from 'utils';
import { setPage } from 'mixins';
import routes, { toRoute, getPortalFromPath } from 'routes';

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
@setPage('clusterStore')
@observer
export default class Clusters extends Component {
  async componentDidMount() {
    const {
      rootStore,
      clusterStore,
      runtimeStore,
      userStore,
      user,
      match
    } = this.props;
    const { appId } = match.params;
    const { isAdmin } = user;

    if (match.path.endsWith('user-instances')) {
      clusterStore.onlyView = true;
    }

    if (appId) {
      clusterStore.appId = appId;
    }

    await clusterStore.fetchAll({
      attachApps: true
    });

    if (isAdmin) {
      await clusterStore.fetchStatistics();
      await userStore.fetchAll({ noLimit: true });
    }
    await runtimeStore.fetchAll({
      status: ['active', 'deleted'],
      noLimit: true
    });

    rootStore.listenToJob(this.handleJobs);
  }

  componentWillUnmount() {
    const { rootStore, clusterStore } = this.props;
    rootStore.cleanSock();
    clusterStore.reset();
  }

  handleJobs = async ({
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

  getAppTdShow = (appId, apps) => {
    const app = apps.find(item => item.app_id === appId);

    return app ? (
      <TdName
        noCopy
        className="smallId"
        name={app.name}
        description={_.get(app, 'latest_app_version.name')}
        image={app.icon}
        linkUrl={`/apps/${appId}`}
      />
    ) : null;
  };

  renderHandleMenu = item => {
    const { t } = this.props;
    const { showOperateCluster } = this.props.clusterStore;
    const { cluster_id, status } = item;

    return (
      <div id={cluster_id} className="operate-menu">
        <Link
          to={toRoute(routes.portal.clusterDetail, {
            clusterId: cluster_id
          })}
        >
          {t('View detail')}
        </Link>
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
    const { clusterStore, t } = this.props;
    const {
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      clusterIds
    } = clusterStore;

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

  renderMain() {
    const {
      clusterStore, appStore, userStore, user, t
    } = this.props;
    const { clusters, isLoading, onlyView } = clusterStore;

    const { runtimes } = this.props.runtimeStore;
    const { apps } = appStore;
    const { users } = userStore;
    const transMap = {
      active: 'normal'
    };

    let columns = [
      {
        title: t('Status'),
        key: 'status',
        width: '90px',
        render: cl => (
          <Status type={cl.status} transition={cl.transition_status} transMap={transMap} />
        )
      },
      {
        title: t('Instance Name ID'),
        key: 'name',
        width: '120px',
        render: cl => (
          <TdName
            name={cl.name}
            description={cl.cluster_id}
            linkUrl={toRoute(routes.portal.clusterDetail, {
              clusterId: cl.cluster_id
            })}
            noIcon
          />
        )
      },
      {
        title: user.isUserPortal ? t('App / Delivery type / Version') : t('Version'),
        key: 'app_id',
        width: '120px',
        render: cl => this.getAppTdShow(cl.app_id, apps.toJSON())
      },
      {
        title: user.isUserPortal ? t('Deploy Runtime') : t('Test Runtime'),
        key: 'runtime_id',
        width: '130px',
        render: cl => (
          <ProviderName
            name={getObjName(runtimes, 'runtime_id', cl.runtime_id, 'name')}
            provider={getObjName(
              runtimes,
              'runtime_id',
              cl.runtime_id,
              'provider'
            )}
          />
        )
      },
      {
        title: t('Node Count'),
        key: 'node_count',
        width: '60px',
        render: cl => (cl.cluster_node_set && cl.cluster_node_set.length) || 0
      },
      {
        title: t('Creator'),
        key: 'owner',
        width: '100px',
        render: item => getObjName(users, 'user_id', item.owner, 'username') || item.owner
      },
      {
        title: t('Created At'),
        key: 'create_time',
        width: '140px',
        sorter: true,
        onChangeSort: this.onChangeSort,
        render: cl => <TimeShow time={cl.create_time} type="detailTime" />
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

    if (getPortalFromPath() !== 'admin') {
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
          { name: t('Normal'), value: 'active' },
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
      <Fragment>
        <div>
          {this.renderToolbar()}
          <Table
            columns={columns}
            dataSource={clusters.toJSON()}
            rowSelection={onlyView ? {} : rowSelection}
            isLoading={isLoading}
            filterList={filterList}
            pagination={pagination}
          />
        </div>

        {this.renderDeleteModal()}
      </Fragment>
    );
  }

  render() {
    const { user, match, t } = this.props;

    if (user.isUserPortal) {
      return this.renderMain();
    }

    const pageTitle = match.path.endsWith('sandbox-instances')
      ? t('Sandbox-Instances')
      : t('Customer-Instances');

    return <Layout pageTitle={pageTitle}>{this.renderMain()}</Layout>;
  }
}

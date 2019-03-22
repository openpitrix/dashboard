import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import _, { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';

import {
  Image, Icon, PopoverIcon, Button
} from 'components/Base';
import Table from 'components/EnhanceTable';
import Layout, { Dialog } from 'components/Layout';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import TimeShow from 'components/TimeShow';
import VersionType from 'components/VersionType';
import TdUser from 'components/TdUser';
import { getObjName } from 'utils';
import { setPage } from 'mixins';
import routes, { toRoute } from 'routes';
import { CLUSTER_TYPE } from 'config/runtimes';

import styles from './index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  clusterStore: rootStore.clusterStore,
  appStore: rootStore.appStore,
  appVersionStore: rootStore.appVersionStore,
  runtimeStore: rootStore.runtimeStore,
  userStore: rootStore.userStore,
  user: rootStore.user
}))
@setPage('clusterStore')
@observer
export default class Clusters extends Component {
  async componentDidMount() {
    await this.queryPageData();
  }

  async componentDidUpdate(prevProps) {
    const { match } = this.props;
    const oldPath = _.get(prevProps, 'match.path', '');

    if (match.path !== oldPath) {
      await this.queryPageData();
    }
  }

  componentWillUnmount() {
    const { rootStore, clusterStore } = this.props;
    rootStore.sock.unlisten(this.handleJobs);
    clusterStore.reset();
  }

  queryPageData = async () => {
    const {
      rootStore, clusterStore, runtimeStore, user, match
    } = this.props;
    const { appId } = match.params;

    clusterStore.onlyView = match.path.endsWith('/instances');

    if (appId) {
      clusterStore.appId = appId;
    }

    if (!user.isUserPortal) {
      clusterStore.attachUsers = true;
    }
    if (!user.isDevPortal) {
      clusterStore.attachApps = true;
    }
    clusterStore.attachVersions = true;

    const params = {
      with_detail: true,
      cluster_type: CLUSTER_TYPE.instance
    };
    if (user.isUserPortal) {
      params.userId = user.user_id;
    }
    Object.assign(clusterStore, params);
    await clusterStore.fetchAll();

    await runtimeStore.fetchAll({
      status: ['active', 'deleted'],
      noLimit: true
    });

    rootStore.sock.listenToJob(this.handleJobs);
  };

  handleJobs = async ({ type = '', resource = {} }) => {
    const { rtype = '', rid = '', values = {} } = resource;
    const op = `${type}:${rtype}`;
    const { clusterStore } = this.props;
    const { jobs } = clusterStore;
    const status = _.pick(values, ['status', 'transition_status']);
    const clusterIds = clusterStore.clusters.map(cl => cl.cluster_id);

    if (op === 'create:job' && clusterIds.includes(values.cluster_id)) {
      // new job
      jobs[rid] = values.cluster_id;
    }

    // job updated
    if (op === 'update:job') {
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

  getDetailLink = clusterId => {
    const { match } = this.props;
    const { appId } = match.params;

    let route;
    if (match.path.endsWith('/:appId/instances')) {
      route = routes.portal._dev.userInstanceDetail;
    } else if (match.path.endsWith('/:appId/sandbox-instances')) {
      route = routes.portal._dev.sandboxInstanceDetail;
    } else {
      route = routes.portal.clusterDetail;
    }

    return toRoute(route, {
      appId,
      clusterId
    });
  };

  handleSubmit = () => {
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

  renderHandleMenu = item => {
    const { t } = this.props;
    const { showOperateCluster } = this.props.clusterStore;
    const { cluster_id, status } = item;

    return (
      <div id={cluster_id} className="operate-menu">
        <Link to={this.getDetailLink(cluster_id)}>
          <Icon name="eye" size={16} type="dark" /> {t('View detail')}
        </Link>
        {status === 'stopped' && (
          <span onClick={() => showOperateCluster(cluster_id, 'start')}>
            <Icon name="start" size={16} type="dark" /> {t('Start cluster')}
          </span>
        )}
        {status === 'active' && (
          <span onClick={() => showOperateCluster(cluster_id, 'stop')}>
            <Icon name="stop" size={16} type="dark" /> {t('Stop cluster')}
          </span>
        )}
        {status !== 'deleted' && (
          <span onClick={() => showOperateCluster(cluster_id, 'delete')}>
            <Icon name="trash" size={16} type="dark" /> {t('Delete')}
          </span>
        )}
      </div>
    );
  };

  renderAppTdShow = (appId, versionId) => {
    const { appStore, appVersionStore, user } = this.props;
    const { apps } = appStore;
    const { versions } = appVersionStore;

    const app = _.find(apps, { app_id: appId }) || {};
    const version = _.find(versions, { version_id: versionId }) || {};

    if (user.isUserPortal || user.isAdmin) {
      return (
        <div className={styles.appTdShow}>
          <label className={styles.appImage}>
            <Image src={app.icon} iconLetter={app.name} iconSize={20} />
          </label>
          <Link
            to={toRoute(routes.appDetail, { appId: app.app_id })}
            className={styles.appName}
          >
            {app.name}
          </Link>
          <VersionType types={version.type} />
          <span className={styles.versionName}>{version.name}</span>
        </div>
      );
    }

    return (
      <div className={styles.appTdShow}>
        <VersionType types={version.type} />
        <span className={styles.versionName}>{version.name}</span>
      </div>
    );
  };

  renderOpsModal = () => {
    const { t } = this.props;
    const { hideModal, isModalOpen, modalType } = this.props.clusterStore;

    return (
      <Dialog
        title={t(`${capitalize(modalType)} cluster`)}
        isOpen={isModalOpen}
        onCancel={hideModal}
        onSubmit={this.handleSubmit}
      >
        <div className={styles.noteWord}>
          {t('operate cluster desc', { operate: t(capitalize(modalType)) })}
        </div>
      </Dialog>
    );
  };

  renderToolbar() {
    const {
      clusterStore, user, match, t
    } = this.props;
    const {
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      clusterIds,
      onlyView
    } = clusterStore;
    const { appId } = match.params;

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
        placeholder={t('Search Instances')}
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
        noRefreshBtn
      >
        {user.isDevPortal && !onlyView && (
          <Link to={toRoute(routes.portal.deploy, { appId })}>
            <Button type="primary" className="pull-right">
              {t('Deploy')}
            </Button>
          </Link>
        )}
      </Toolbar>
    );
  }

  renderMain() {
    const {
      clusterStore, userStore, user, t
    } = this.props;
    const { isLoading, onlyView } = clusterStore;
    const { runtimes } = this.props.runtimeStore;
    const { users } = userStore;
    const transMap = {
      active: 'normal'
    };

    const columns = [
      {
        title: t('Status'),
        key: 'status',
        render: cl => (
          <Status
            type={cl.status}
            transition={cl.transition_status}
            transMap={transMap}
          />
        )
      },
      {
        title: t('Instance Name ID'),
        key: 'name',
        render: cl => (
          <TdName
            name={cl.name}
            description={cl.cluster_id}
            linkUrl={this.getDetailLink(cl.cluster_id)}
            noIcon
          />
        )
      },
      {
        title: user.isUserPortal
          ? t('App / Delivery type / Version')
          : t('Version'),
        key: 'app_id',
        render: cl => this.renderAppTdShow(cl.app_id, cl.version_id)
      },
      {
        title:
          user.isUserPortal || onlyView
            ? t('Deploy Runtime')
            : t('Test Runtime'),
        key: 'runtime_id',
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
        className: 'number',
        render: cl => (cl.cluster_node_set && cl.cluster_node_set.length) || 0
      },
      {
        title: t('Creator'),
        key: 'owner',
        render: cl => (
          <TdUser className={styles.creator} users={users} userId={cl.owner} />
        )
      },
      {
        title: t('Created At'),
        key: 'create_time',
        sorter: true,
        onChangeSort: this.onChangeSort,
        render: cl => <TimeShow time={cl.create_time} type="detailTime" />
      },
      {
        title: '',
        key: 'actions',
        className: 'actions',
        width: onlyView ? '100px' : '80px',
        render: cl => (onlyView ? (
            <div>
              <Link to={this.getDetailLink(cl.cluster_id)}>
                {t('View detail')} →
              </Link>
            </div>
        ) : (
            <PopoverIcon content={this.renderHandleMenu(cl)} />
        ))
      }
    ];

    return (
      <Fragment>
        {this.renderToolbar()}

        <Table
          tableType="Clusters"
          columns={columns}
          columnsFilter={cols => {
            if (user.isUserPortal) {
              return cols.filter(item => item.key !== 'owner');
            }
            return cols;
          }}
          store={clusterStore}
          data={clusterStore.clusters}
          hasRowSelection={!onlyView}
          isLoading={isLoading}
          replaceFilterConditions={[
            { name: t('Pending'), value: 'pending' },
            { name: t('Normal'), value: 'active' },
            { name: t('Stopped'), value: 'stopped' },
            { name: t('Suspended'), value: 'suspended' },
            { name: t('Deleted'), value: 'deleted' },
            { name: t('Ceased'), value: 'ceased' }
          ]}
        />

        {this.renderOpsModal()}
      </Fragment>
    );
  }

  render() {
    const { user, match, t } = this.props;

    if (user.isUserPortal) {
      return this.renderMain();
    }

    let pageTitle = match.path.endsWith('sandbox-instances')
      ? t('Sandbox-Instances')
      : t('Customer-Instances');

    if (user.isAdmin) {
      pageTitle = t('Test instance');
    }

    return (
      <Layout
        pageTitle={pageTitle}
        isCenterPage={user.isAdmin}
        noSubMenu={user.isAdmin}
      >
        {this.renderMain()}
      </Layout>
    );
  }
}

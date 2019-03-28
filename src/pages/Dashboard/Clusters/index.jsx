import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import _, { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';

import { Image, Icon, Button } from 'components/Base';
import Table from 'components/EnhanceTable';
import Layout, { Dialog } from 'components/Layout';
import Tabs from 'components/DetailTabs';
import Toolbar from 'components/Toolbar';
import VersionType from 'components/VersionType';

import { setPage } from 'mixins';
import routes, { toRoute } from 'routes';
import { CLUSTER_TYPE, runtimeTabs } from 'config/runtimes';

import columns from './columns';
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
  static propTypes = {
    fetchData: PropTypes.func,
    title: PropTypes.string
  };

  static defaultProps = {
    title: ''
  };

  async componentDidMount() {
    const {
      rootStore,
      clusterStore,
      runtimeStore,
      user,
      fetchData
    } = this.props;

    if (_.isFunction(fetchData)) {
      fetchData();
    } else {
      const { cluster_type } = clusterStore;

      Object.assign(clusterStore, {
        attachUsers: !user.isUserPortal,
        attachVersions: cluster_type === CLUSTER_TYPE.instance,
        attachApps: !user.isDevPortal,
        with_detail: true,
        cluster_type: CLUSTER_TYPE.instance, // default fetch instance
        userId: (user.isUserPortal || user.isAdminPortal) && user.user_id
      });

      await clusterStore.fetchAll();

      await runtimeStore.fetchAll({
        status: ['active', 'deleted'],
        noLimit: true
      });
    }

    rootStore.sock.listenToJob(this.handleJobs);
  }

  componentWillUnmount() {
    const { rootStore, clusterStore } = this.props;
    rootStore.sock.unlisten(this.handleJobs);
    clusterStore.reset();
  }

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

  handleChangeTab = async tab => {
    const { clusterStore } = this.props;

    Object.assign(clusterStore, {
      cluster_type: tab,
      isAgent: tab === CLUSTER_TYPE.agent,
      attachVersions: tab === CLUSTER_TYPE.instance,
      attachApps: tab === CLUSTER_TYPE.instance
    });

    await clusterStore.fetchAll();
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
      onlyView,
      isAgent
    } = clusterStore;
    const { appId } = match.params;

    if (!(onlyView || isAgent) && clusterIds.length) {
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
    const { isLoading, onlyView, isAgent } = clusterStore;

    const { runtimes } = this.props.runtimeStore;
    const { users } = userStore;

    return (
      <Fragment>
        <Tabs
          tabs={runtimeTabs}
          className={styles.tabs}
          changeTab={this.handleChangeTab}
          noFirstChange
          isCardTab
        />
        {this.renderToolbar()}
        <Table
          tableType="Clusters"
          columns={columns}
          columnsFilter={cols => {
            if (user.isUserPortal || user.isAdminPortal) {
              cols = cols.filter(item => item.key !== 'owner');
            }
            if (isAgent) {
              cols = cols.filter(
                item => item.key !== 'app_id' && item.key !== 'actions'
              );
            }
            return cols;
          }}
          store={clusterStore}
          data={clusterStore.clusters}
          hasRowSelection={!(onlyView || isAgent)}
          isLoading={isLoading}
          replaceFilterConditions={[
            { name: t('Pending'), value: 'pending' },
            { name: t('Normal'), value: 'active' },
            /* { name: t('Stopped'), value: 'stopped' },
            { name: t('Suspended'), value: 'suspended' }, */
            { name: t('Deleted'), value: 'deleted' },
            { name: t('Ceased'), value: 'ceased' }
          ]}
          inject={{
            getDetailLink: this.getDetailLink,
            renderAppTdShow: this.renderAppTdShow,
            renderHandleMenu: this.renderHandleMenu,
            users,
            user,
            runtimes,
            onlyView,
            isAgent,
            t
          }}
        />

        {this.renderOpsModal()}
      </Fragment>
    );
  }

  render() {
    const { user, title, t } = this.props;

    if (user.isUserPortal) {
      return this.renderMain();
    }

    let pageTitle = title || '';

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

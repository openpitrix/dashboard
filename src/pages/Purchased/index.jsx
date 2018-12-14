import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import _, { capitalize } from 'lodash';
import { translate } from 'react-i18next';
import classNames from 'classnames';

import {
  Icon, Table, Popover, Image
} from 'components/Base';
import Layout, {
  Dialog, Grid, Section, Card
} from 'components/Layout';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import { formatTime, getObjName } from 'utils';

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
export default class Purchased extends Component {
  async componentDidMount() {
    const { clusterStore, appStore, runtimeStore } = this.props;
    // clusterStore.registerStore('app', appStore);

    await clusterStore.fetchAll({ noLimit: true });
    const appIds = clusterStore.clusters.map(cluster => cluster.app_id);
    if (appIds.length) {
      await appStore.fetchAll({ app_id: appIds });
      appStore.storeApps = appStore.apps.slice();
      await runtimeStore.fetchAll({
        status: ['active', 'deleted'],
        noLimit: true,
        simpleQuery: true
      });
    } else {
      appStore.storeApps = [];
    }
  }

  componentWillUnmount() {
    const { clusterStore, appStore } = this.props;
    clusterStore.reset();
    appStore.reset();
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

  onChangeSort = (params = {}) => {
    const { clusterStore } = this.props;
    const order = params.reverse ? 'asc' : 'desc';
    clusterStore.clusters = _.orderBy(
      clusterStore.clusters,
      params.sort_key,
      order
    );
  };

  selectClusters = appId => {
    const { clusterStore } = this.props;
    clusterStore.appId = appId;
    clusterStore.fetchAll();
  };

  handleCluster = () => {
    const { clusterStore } = this.props;
    const {
      clusterId, clusterIds, modalType, operateType
    } = clusterStore;
    const ids = operateType === 'multiple' ? clusterIds.toJSON() : [clusterId];
    switch (modalType) {
      case 'delete':
        clusterStore.remove(ids);
        break;
      case 'start':
        clusterStore.start(ids);
        break;
      case 'stop':
        clusterStore.stop(ids);
        break;
      default:
        break;
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
        linkUrl={`/store/${appId}`}
      />
    ) : null;
  };

  renderHandleMenu = item => {
    const { clusterStore, runtimeStore, t } = this.props;
    const { runtimes } = runtimeStore;
    const { showOperateCluster } = clusterStore;
    const { cluster_id, status, runtime_id } = item;
    const provider = getObjName(runtimes, 'runtime_id', runtime_id, 'provider');

    return (
      <div id={cluster_id} className="operate-menu">
        <Link to={`/dashboard/cluster/${cluster_id}`}>{t('View detail')}</Link>
        {provider !== 'kubernetes'
          && status === 'stopped' && (
            <span onClick={() => showOperateCluster(cluster_id, 'start')}>
              {t('Start cluster')}
            </span>
        )}
        {provider !== 'kubernetes'
          && status === 'active' && (
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

  renderApps() {
    const { storeApps } = this.props.appStore;
    const { appId } = this.props.clusterStore;

    return (
      <ul className={styles.appList}>
        {storeApps.slice(0, 10).map(app => (
          <li
            key={app.app_id}
            className={classNames({ [styles.active]: app.app_id === appId })}
            onClick={() => this.selectClusters(app.app_id)}
          >
            <span className={styles.image}>
              <Image src={app.icon} iconSize={36} iconLetter={app.name} />
            </span>
            <div className={styles.word}>
              <div className={styles.name}>{app.name}</div>
              <div className={styles.description}>{app.description}</div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  renderToolbar() {
    const { t } = this.props;
    const {
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh
    } = this.props.clusterStore;

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
    const { clusterStore, appStore, t } = this.props;
    const { clusters, appId, isLoading } = clusterStore;
    const runtimes = this.props.runtimeStore.allRuntimes;
    const { apps } = appStore;

    const columns = [
      {
        title: t('Cluster Name'),
        key: 'name',
        width: '130px',
        render: item => (
          <TdName
            name={item.name}
            description={item.cluster_id}
            linkUrl={`/purchased/${item.cluster_id}`}
            noIcon
          />
        )
      },
      {
        title: t('Status'),
        key: 'status',
        width: '102px',
        render: item => (
          <Status type={item.status} transition={item.transition_status} />
        )
      },
      {
        title: t('App'),
        key: 'app_id',
        width: '130px',
        render: cl => this.getAppTdShow(cl.app_id, apps.toJSON())
      },
      {
        title: t('Runtime'),
        key: 'runtime_id',
        width: '130px',
        render: item => (
          <Link to={`/dashboard/runtime/${item.runtime_id}`}>
            <ProviderName
              name={getObjName(runtimes, 'runtime_id', item.runtime_id, 'name')}
              provider={getObjName(
                runtimes,
                'runtime_id',
                item.runtime_id,
                'provider'
              )}
            />
          </Link>
        )
      },
      {
        title: t('Node Count'),
        key: 'node_count',
        width: '85px',
        render: item => (item.cluster_node_set && item.cluster_node_set.length) || 0
      },
      {
        title: t('Created At'),
        key: 'create_time',
        width: '90px',
        render: item => formatTime(item.create_time, 'YYYY/MM/DD HH:mm:ss')
      },
      {
        title: t('Actions'),
        key: 'actions',
        width: '84px',
        className: 'actions',
        render: item => (
          <Popover content={this.renderHandleMenu(item)} className="actions">
            <Icon name="more" />
          </Popover>
        )
      }
    ];

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
      <Layout pageTitle="Purchased" listenToJob={this.listenToJob}>
        <Grid>
          <Section size={3}>
            <div className={styles.title}>{t('Apps')}</div>
            <div
              className={classNames(styles.all, { [styles.active]: !appId })}
              onClick={() => this.selectClusters('')}
            >
              {t('All Apps')}
            </div>
            {this.renderApps()}
          </Section>
          <Section size={9}>
            <div className={styles.title}>{t('Clusters')}</div>
            <Card>
              {this.renderToolbar()}
              <Table
                columns={columns}
                dataSource={clusters.slice(0, 10)}
                isLoading={isLoading}
                filterList={filterList}
                pagination={pagination}
              />
            </Card>
          </Section>
        </Grid>

        {this.renderDeleteModal()}
      </Layout>
    );
  }
}

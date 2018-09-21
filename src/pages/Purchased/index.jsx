import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { translate } from 'react-i18next';
import classNames from 'classnames';

import { Icon, Button, Table, Popover, Image } from 'components/Base';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import Layout, { Dialog, Grid, Row, Section, Card } from 'components/Layout';
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
  static async onEnter({ clusterStore, appStore, runtimeStore }) {
    await clusterStore.fetchAll();
    await appStore.fetchAll({ status: 'active', noLimit: true });
    await runtimeStore.fetchAll({
      status: ['active', 'deleted'],
      noLimit: true,
      simpleQuery: true
    });
  }

  constructor(props) {
    super(props);
    const { clusterStore, appStore, runtimeStore } = this.props;
    clusterStore.loadPageInit();
    appStore.loadPageInit();
    runtimeStore.loadPageInit();
    this.store = clusterStore;
  }

  listenToJob = async ({ op, rtype, rid, values = {} }) => {
    const { clusterStore } = this.props;
    const { jobs } = clusterStore;
    const status = _.pick(values, ['status', 'transition_status']);
    const logJobs = () => clusterStore.info(`${op}: ${rid}, ${JSON.stringify(status)}`);
    const clusterIds = clusterStore.clusters.map(cl => cl.cluster_id);

    if (op === 'create:job' && clusterIds.includes(values.cluster_id)) {
      // new job
      jobs[rid] = values.cluster_id;
      logJobs();
    }

    // job updated
    if (op === 'update:job' && clusterIds.includes(jobs[rid])) {
      if (['successful', 'failed'].includes(status.status)) {
        delete jobs[rid];
        await clusterStore.fetchAll();
      }
      logJobs();
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
    clusterStore.clusters = _.orderBy(clusterStore.clusters, params.sort_key, order);
  };

  selectClusters = appId => {
    const { clusterStore } = this.props;
    clusterStore.appId = appId;
    clusterStore.fetchAll();
  };

  renderApps() {
    const { apps } = this.props.appStore;
    const { appId } = this.props.clusterStore;

    return (
      <ul className={styles.appList}>
        {apps.slice(0, 10).map(app => (
          <li
            key={app.app_id}
            className={classNames({ [styles.active]: app.app_id === appId })}
            onClick={() => this.selectClusters(app.app_id)}
          >
            <span className={styles.image}>
              <Image src={app.icon} iconSize={36} />
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
    const { searchWord, onSearch, onClearSearch, onRefresh } = this.props.clusterStore;

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
    const { clusters, appId, isLoading } = clusterStore;
    const runtimes = this.props.runtimeStore.allRuntimes;

    const columns = [
      {
        title: t('Cluster Name'),
        key: 'name',
        width: '155px',
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
        render: item => <Status type={item.status} transition={item.transition_status} />
      },
      {
        title: t('Runtime'),
        key: 'runtime_id',
        render: item => (
          <Link to={`/dashboard/runtime/${item.runtime_id}`}>
            <ProviderName
              name={getObjName(runtimes, 'runtime_id', item.runtime_id, 'name')}
              provider={getObjName(runtimes, 'runtime_id', item.runtime_id, 'provider')}
            />
          </Link>
        )
      },
      {
        title: t('Node Count'),
        key: 'node_count',
        render: item => (item.cluster_node_set && item.cluster_node_set.length) || 0
      },
      {
        title: t('Created At'),
        key: 'create_time',
        width: '150px',
        sorter: true,
        onChangeSort: this.onChangeSort,
        render: item => formatTime(item.create_time, 'YYYY/MM/DD HH:mm:ss')
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
      <Layout title="Purchased" listenToJob={this.listenToJob}>
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
                dataSource={clusters.toJSON()}
                isLoading={isLoading}
                filterList={filterList}
                pagination={pagination}
              />
            </Card>
          </Section>
        </Grid>
      </Layout>
    );
  }
}

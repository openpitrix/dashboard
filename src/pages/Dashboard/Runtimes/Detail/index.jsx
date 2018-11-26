import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { get, capitalize, pick } from 'lodash';
import { translate } from 'react-i18next';

import {
  Icon, Table, Popover, Button
} from 'components/Base';
import Layout, {
  Dialog,
  BackBtn,
  Grid,
  Section,
  Card,
  Panel,
  BreadCrumb
} from 'components/Layout';
import Status from 'components/Status';
import DetailTabs from 'components/DetailTabs';
import Toolbar from 'components/Toolbar';
import TdName from 'components/TdName';
import TimeShow from 'components/TimeShow';
import RuntimeCard from 'components/DetailCard/RuntimeCard';
import { getObjName } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore,
  clusterStore: rootStore.clusterStore,
  appStore: rootStore.appStore,
  userStore: rootStore.userStore,
  user: rootStore.user
}))
@observer
class RuntimeDetail extends Component {
  async componentDidMount() {
    const {
      runtimeStore,
      clusterStore,
      appStore,
      userStore,
      user,
      match
    } = this.props;
    const { runtimeId } = match.params;

    await runtimeStore.fetch(runtimeId);

    clusterStore.runtimeId = runtimeId;
    await clusterStore.fetchAll({
      runtime_id: runtimeId
    });

    await appStore.fetchAll({
      status: ['active', 'deleted'],
      noLimit: true
    });

    if (user.isAdmin) {
      await userStore.fetchAll({ noLimit: true });
    } else {
      const { runtimeDetail } = runtimeStore;
      await userStore.fetchDetail(runtimeDetail.owner);
    }
  }

  componentDidUpdate() {
    const { runtimeDeleted } = this.props.runtimeStore;
    if (get(runtimeDeleted, 'runtime_id')) {
      this.props.history.back();
    }
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
    const status = pick(values, ['status', 'transition_status']);
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

  renderHandleMenu = id => {
    const { runtimeStore, t } = this.props;
    const { showDeleteRuntime } = runtimeStore;

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/runtime/edit/${id}`}>{t('Modify Runtime')}</Link>
        <span onClick={() => showDeleteRuntime(id)}>{t('Delete')}</span>
      </div>
    );
  };

  renderClusterHandle = item => {
    const { t } = this.props;
    const { showOperateCluster } = this.props.clusterStore;
    const { cluster_id, status } = item;

    return (
      <div className="operate-menu">
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

  renderClusterModal = () => {
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

  renderDeleteModal = () => {
    const { runtimeStore, t } = this.props;
    const { isModalOpen, hideModal, remove } = runtimeStore;

    return (
      <Dialog
        title={t('Delete Runtime')}
        isOpen={isModalOpen}
        onSubmit={remove}
        onCancel={hideModal}
      >
        {t('Delete Runtime desc')}
      </Dialog>
    );
  };

  renderToolbar() {
    const { t } = this.props;
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
          <Button
            type="delete"
            onClick={() => this.operateSelected('delete')}
            className="btn-handle"
          >
            {t('Delete')}
          </Button>
          <Button type="default" onClick={() => this.operateSelected('start')}>
            {t('Start')}
          </Button>
          <Button type="delete" onClick={() => this.operateSelected('stop')}>
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
    const {
      runtimeStore, clusterStore, userStore, user, t
    } = this.props;
    const { runtimeDetail } = runtimeStore;

    const {
      clusters,
      totalCount,
      clusterCount,
      isLoading,
      currentPage,
      selectStatus
    } = clusterStore;

    const { apps } = this.props.appStore;
    const { isNormal, isDev, isAdmin } = user;
    const { users, userDetail } = userStore;

    let columns = [
      {
        title: t('Cluster Name'),
        key: 'name',
        width: '130px',
        render: item => (
          <TdName
            name={item.name}
            description={item.cluster_id}
            linkUrl={`/dashboard/cluster/${item.cluster_id}`}
          />
        )
      },
      {
        title: t('Status'),
        key: 'status',
        width: '90px',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: t('App'),
        key: 'app_id',
        width: '90px',
        render: item => (
          <Link to={`/dashboard/app/${item.app_id}`}>
            {getObjName(apps, 'app_id', item.app_id, 'name')}
          </Link>
        )
      },
      {
        title: t('Node Count'),
        key: 'node_count',
        width: '68px',
        render: item => (item.cluster_node_set && item.cluster_node_set.length) || 0
      },
      {
        title: t('User'),
        key: 'owner',
        width: '80px',
        render: item => getObjName(users, 'user_id', item.owner, 'username') || item.owner
      },
      {
        title: t('Updated At'),
        key: 'status_time',
        width: '75px',
        render: item => <TimeShow time={item.status_time} />
      },
      {
        title: t('Actions'),
        key: 'actions',
        width: '84px',
        render: item => (
          <Popover content={this.renderClusterHandle(item)} className="actions">
            <Icon name="more" />
          </Popover>
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
        selectValue: selectStatus
      }
    ];

    const pagination = {
      tableType: 'Clusters',
      onChange: clusterStore.changePagination,
      total: totalCount,
      current: currentPage,
      noCancel: false
    };

    let userName = getObjName(
      users,
      'user_id',
      runtimeDetail.owner,
      'username'
    );
    if (!isAdmin) {
      userName = userDetail.username;
      columns = columns.filter(item => item.key !== 'owner');
    }
    const linkPath = isDev
      ? `My Apps>Runtimes>${runtimeDetail.name}`
      : `Platform>Runtimes>${runtimeDetail.name}`;

    return (
      <Layout
        title="runtimeDetail"
        backBtn={isNormal && <BackBtn label="My Runtimes" link="/runtimes" />}
        listenToJob={this.listenToJob}
      >
        {!isNormal && <BreadCrumb linkPath={linkPath} />}

        <Grid>
          <Section>
            <Card>
              <RuntimeCard
                detail={runtimeDetail}
                clusterCount={clusterCount}
                userName={userName}
              />
              {runtimeDetail.status !== 'deleted' && (
                <Popover
                  className="operation"
                  content={this.renderHandleMenu(runtimeDetail.runtime_id)}
                >
                  <Icon name="more" />
                </Popover>
              )}
            </Card>
          </Section>
          <Section size={8}>
            <Panel>
              <DetailTabs tabs={['Clusters']} />
              <Card hasTable>
                {this.renderToolbar()}
                <Table
                  columns={columns}
                  dataSource={clusters.toJSON()}
                  isLoading={isLoading}
                  rowSelection={rowSelection}
                  filterList={filterList}
                  pagination={pagination}
                />
              </Card>
            </Panel>
          </Section>
        </Grid>
        {this.renderDeleteModal()}
        {this.renderClusterModal()}
      </Layout>
    );
  }
}
export default withRouter(RuntimeDetail);

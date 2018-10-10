import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { translate } from 'react-i18next';

import { Icon, Table, Popover } from 'components/Base';
import Layout, { Dialog, BackBtn, Grid, Section, Card, Panel, BreadCrumb } from 'components/Layout';
import Status from 'components/Status';
import DetailTabs from 'components/DetailTabs';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
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
export default class RuntimeDetail extends Component {
  async componentDidMount() {
    const { runtimeStore, clusterStore, appStore, userStore, user, match } = this.props;
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

  componentWillUnmount() {
    const { clusterStore } = this.props;

    clusterStore.loadPageInit();
  }

  componentDidUpdate() {
    const { runtimeDeleted } = this.props.runtimeStore;
    if (get(runtimeDeleted, 'runtime_id')) {
      history.back();
    }
  }

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

  render() {
    const { runtimeStore, clusterStore, userStore, user, t } = this.props;
    const { runtimeDetail } = runtimeStore;

    const {
      clusters,
      totalCount,
      clusterCount,
      isLoading,
      currentPage,
      searchWord,
      selectStatus
    } = clusterStore;

    const { apps } = this.props.appStore;
    const { isNormal, isDev, isAdmin } = user;
    const { users, userDetail } = userStore;

    let columns = [
      {
        title: t('Cluster Name'),
        key: 'name',
        width: '135px',
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
        width: '100px',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: t('App'),
        key: 'app_id',
        width: '100px',
        render: item => (
          <Link to={`/dashboard/app/${item.app_id}`}>
            {getObjName(apps, 'app_id', item.app_id, 'name')}
          </Link>
        )
      },
      {
        title: t('Node Count'),
        key: 'node_count',
        width: '70px',
        render: item => (item.cluster_node_set && item.cluster_node_set.length) || 0
      },
      {
        title: t('User'),
        key: 'owner',
        render: item => getObjName(users, 'user_id', item.owner, 'username') || item.owner
      },
      {
        title: t('Updated At'),
        key: 'status_time',
        width: '95px',
        render: item => <TimeShow time={item.status_time} />
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
        selectValue: selectStatus
      }
    ];

    const pagination = {
      tableType: 'Clusters',
      onChange: clusterStore.changePagination,
      total: totalCount,
      current: currentPage
    };

    let userName = getObjName(users, 'user_id', runtimeDetail.owner, 'username');
    if (!isAdmin) {
      userName = userDetail.username;
      columns = columns.filter(item => item.key !== 'owner');
    }
    const linkPath = isDev
      ? `My Apps>Runtimes>${runtimeDetail.name}`
      : `Platform>Runtimes>${runtimeDetail.name}`;

    return (
      <Layout
        title="My Runtimes"
        backBtn={isNormal && <BackBtn label="runtimes" link="/runtimes" />}
      >
        {!isNormal && <BreadCrumb linkPath={linkPath} />}

        <Grid>
          <Section>
            <Card>
              <RuntimeCard detail={runtimeDetail} clusterCount={clusterCount} userName={userName} />
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
                <Toolbar
                  placeholder={t('Search Clusters')}
                  searchWord={searchWord}
                  onSearch={clusterStore.onSearch}
                  onClear={clusterStore.onClearSearch}
                  onRefresh={clusterStore.onRefresh}
                />
                <Table
                  columns={columns}
                  dataSource={clusters.toJSON()}
                  isLoading={isLoading}
                  filterList={filterList}
                  pagination={pagination}
                />
              </Card>
            </Panel>
          </Section>
        </Grid>
        {this.renderDeleteModal()}
      </Layout>
    );
  }
}

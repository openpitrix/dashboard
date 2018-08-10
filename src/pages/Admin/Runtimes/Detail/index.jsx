import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { translate } from 'react-i18next';

import { Icon, Table, Popover } from 'components/Base';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import RuntimeCard from 'components/DetailCard/RuntimeCard';
import Layout, { Dialog, BackBtn, Grid, Section, Card, Panel } from 'components/Layout';
import TimeShow from 'components/TimeShow';
import { getObjName } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore,
  clusterStore: rootStore.clusterStore,
  appStore: rootStore.appStore
}))
@observer
export default class RuntimeDetail extends Component {
  static async onEnter({ runtimeStore, clusterStore, appStore }, { runtimeId }) {
    clusterStore.changeRuntimeId(runtimeId);
    await runtimeStore.fetch(runtimeId);
    await clusterStore.fetchAll({
      runtime_id: runtimeId
    });
    await appStore.fetchApps({
      status: ['active', 'deleted']
    });
  }

  constructor(props) {
    super(props);
    this.runtimeId = props.match.params.runtimeId;
    this.props.clusterStore.loadPageInit();
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
        <span onClick={() => showDeleteRuntime(id)}>{t('Delete Runtime')}</span>
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

  onSearch = async name => {
    const { changeSearchWord, setCurrentPage, fetchAll } = this.props.clusterStore;
    changeSearchWord(name);
    setCurrentPage(1);
    await fetchAll({
      runtime_id: this.runtimeId
    });
  };

  onClear = async () => {
    await this.onSearch('');
  };

  onRefresh = async () => {
    const { fetchAll } = this.props.clusterStore;
    await fetchAll({
      runtime_id: this.runtimeId
    });
  };

  changeTable = async current => {
    const { setCurrentPage, fetchAll } = this.props.clusterStore;
    setCurrentPage(current);
    await fetchAll({
      runtime_id: this.runtimeId
    });
  };

  onChangeStatus = async status => {
    const { clusterStore } = this.props;
    clusterStore.selectStatus = clusterStore.selectStatus === status ? '' : status;
    clusterStore.setCurrentPage(1);
    await clusterStore.fetchAll({
      runtime_id: this.runtimeId
    });
  };

  render() {
    const { runtimeStore, clusterStore, t } = this.props;
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

    const columns = [
      {
        title: t('Cluster Name'),
        key: 'name',
        width: '155px',
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
        render: item => (
          <Link to={`/dashboard/app/${item.app_id}`}>
            {getObjName(apps, 'app_id', item.app_id, 'name')}
          </Link>
        )
      },
      {
        title: t('Node Count'),
        key: 'node_count',
        render: item => (item.cluster_node_set && item.cluster_node_set.length) || 0
      },
      {
        title: t('User'),
        key: 'owner',
        dataIndex: 'owner'
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
        onChangeFilter: this.onChangeStatus,
        selectValue: selectStatus
      }
    ];

    const pagination = {
      tableType: 'Clusters',
      onChange: this.changeTable,
      total: totalCount,
      current: currentPage
    };

    return (
      <Layout backBtn={<BackBtn label="runtimes" link="/dashboard/runtimes" />}>
        <Grid>
          <Section>
            <Card>
              <RuntimeCard detail={runtimeDetail} clusterCount={clusterCount} />
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
              <TagNav tags={['Clusters']} />
              <Card>
                <Toolbar
                  placeholder={t('Search Clusters')}
                  searchWord={searchWord}
                  onSearch={this.onSearch}
                  onClear={this.onClear}
                  onRefresh={this.onRefresh}
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

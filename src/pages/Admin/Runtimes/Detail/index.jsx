import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

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
    await appStore.fetchAll({
      status: ['active', 'deleted'],
      limit: 999
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
    const { runtimeStore } = this.props;
    const { showDeleteRuntime } = runtimeStore;

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/runtime/edit/${id}`}>Modify runtime</Link>
        <span onClick={() => showDeleteRuntime(id)}>Delete runtime</span>
      </div>
    );
  };

  renderDeleteModal = () => {
    const { runtimeStore } = this.props;
    const { isModalOpen, hideModal, remove } = runtimeStore;

    return (
      <Dialog title="Delete Runtime" isOpen={isModalOpen} onSubmit={remove} onCancel={hideModal}>
        Are you sure delete this Runtime?
      </Dialog>
    );
  };

  render() {
    const { runtimeStore, clusterStore } = this.props;
    const { runtimeDetail, notifyMsg, hideMsg, notifyType } = runtimeStore;
    const {
      clusters,
      totalCount,
      clusterCount,
      isLoading,
      currentPage,
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      changePagination,
      onChangeStatus,
      selectStatus
    } = clusterStore;

    const { apps } = this.props.appStore;

    const columns = [
      {
        title: 'Cluster Name',
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
        title: 'Status',
        key: 'status',
        width: '100px',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: 'App',
        key: 'app_id',
        render: item => (
          <Link to={`/dashboard/app/${item.app_id}`}>
            {getObjName(apps, 'app_id', item.app_id, 'name')}
          </Link>
        )
      },
      {
        title: 'Node Count',
        key: 'node_count',
        render: item => item.cluster_node_set && item.cluster_node_set.length
      },
      {
        title: 'User',
        key: 'owner',
        dataIndex: 'owner'
      },
      {
        title: 'Updated At',
        key: 'status_time',
        width: '95px',
        render: item => <TimeShow time={item.status_time} />
      }
    ];

    const filterList = [
      {
        key: 'status',
        conditions: [
          { name: 'Active', value: 'active' },
          { name: 'Stopped', value: 'stopped' },
          { name: 'Ceased', value: 'ceased' },
          { name: 'Pending', value: 'pending' },
          { name: 'Suspended', value: 'suspended' },
          { name: 'Deleted', value: 'deleted' }
        ],
        onChangeFilter: onChangeStatus,
        selectValue: selectStatus
      }
    ];

    const pagination = {
      tableType: 'Clusters',
      onChange: changePagination,
      total: totalCount,
      current: currentPage
    };

    return (
      <Layout
        msg={notifyMsg}
        msgType={notifyType}
        hideMsg={hideMsg}
        backBtn={<BackBtn label="runtimes" link="/dashboard/runtimes" />}
      >
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
                  placeholder="Search Clusters Name"
                  searchWord={searchWord}
                  onSearch={onSearch}
                  onClear={onClearSearch}
                  onRefresh={onRefresh}
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

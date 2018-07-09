import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';

import { Button, Icon, Input, Table, Pagination, Popover } from 'components/Base';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import TdName from 'components/TdName';
import RuntimeCard from 'components/DetailCard/RuntimeCard';
import Layout, { BackBtn } from 'components/Layout/Admin';
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
      runtime_id: runtimeId,
      status: ['active', 'stopped', 'ceased', 'pending', 'suspended', 'deleted']
    });
    await appStore.fetchAll({ status: ['active', 'deleted'] });
  }

  constructor(props) {
    super(props);
    this.runtimeId = props.match.params.runtimeId;
    this.props.clusterStore.loadPageInit();
  }

  renderHandleMenu = id => {
    return (
      <div className="operate-menu">
        <Link to={`/dashboard/runtime/edit/${id}`}>Modify runtime</Link>
      </div>
    );
  };

  render() {
    const { runtimeStore, clusterStore } = this.props;
    const { runtimeDetail } = runtimeStore;
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
      changePagination
    } = clusterStore;
    const { apps } = this.props.appStore;

    const columns = [
      {
        title: 'Cluster Name',
        key: 'name',
        width: '170px',
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
        width: '120px',
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
        width: '120px',
        render: item => <TimeShow time={item.status_time} />
      }
    ];
    const tags = [{ id: 1, name: 'Clusters' }];
    const curTag = 'Clusters';

    return (
      <Layout>
        <BackBtn label="runtimes" link="/dashboard/runtimes" />
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <div className={styles.detailOuter}>
              <RuntimeCard detail={runtimeDetail} clusterCount={clusterCount} />
              {runtimeDetail.status !== 'deleted' && (
                <Popover
                  className={styles.operation}
                  content={this.renderHandleMenu(runtimeDetail.runtime_id)}
                >
                  <Icon name="more" />
                </Popover>
              )}
            </div>
          </div>
          <div className={styles.rightInfo}>
            <div className={styles.wrapper2}>
              <TagNav tags={tags} curTag={curTag} />
              <div className={styles.toolbar}>
                <Input.Search
                  className={styles.search}
                  placeholder="Search Clusters Name"
                  value={searchWord}
                  onSearch={onSearch}
                  onClear={onClearSearch}
                  maxlength="50"
                />
                <Button className={styles.buttonRight} onClick={onRefresh}>
                  <Icon name="refresh" />
                </Button>
              </div>
              <Table
                columns={columns}
                dataSource={clusters.toJSON()}
                className="detailTab"
                isLoading={isLoading}
              />
            </div>
            <ul />
            <Pagination onChange={changePagination} total={totalCount} current={currentPage} />
          </div>
        </div>
      </Layout>
    );
  }
}

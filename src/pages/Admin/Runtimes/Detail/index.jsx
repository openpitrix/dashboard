import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';

import { Button, Icon, Input, Table, Pagination, Popover } from 'components/Base';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import TdName from 'components/TdName';
import RuntimeCard from 'components/DetailCard/RuntimeCard';

import Layout, { BackBtn } from 'components/Layout/Admin';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore,
  clusterStore: rootStore.clusterStore
}))
@observer
export default class RuntimeDetail extends Component {
  static async onEnter({ runtimeStore, clusterStore }, { runtimeId }) {
    clusterStore.loadPageInit();
    clusterStore.changeRuntimeId(runtimeId);
    await runtimeStore.fetch(runtimeId);
    await clusterStore.fetchAll({ runtime_id: runtimeId });
  }

  constructor(props) {
    super(props);
    this.runtimeId = props.match.params.runtimeId;
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
      isLoading,
      currentPage,
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      changePagination
    } = clusterStore;

    const columns = [
      {
        title: 'Cluster Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, obj) => (
          <TdName
            name={name}
            description={obj.cluster_id}
            linkUrl={`/dashboard/cluster/${obj.cluster_id}`}
          />
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '120px',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'App Version',
        dataIndex: 'version_id',
        key: 'version_id',
        render: cl => cl.version_id
      },
      {
        title: 'Node Count',
        key: 'node_count',
        render: cl => cl.cluster_node_set && cl.cluster_node_set.length
      },
      {
        title: 'Runtime',
        dataIndex: 'runtime_id',
        key: 'runtime_id'
      },
      {
        title: 'User',
        dataIndex: 'owner',
        key: 'owner'
      },
      {
        title: 'Date Created',
        dataIndex: 'create_time',
        key: 'create_time',
        render: getParseDate
      }
    ];
    const tags = [{ id: 1, name: 'Clusters' }];
    const curTag = 'Clusters';

    return (
      <Layout isLoading={isLoading}>
        <BackBtn label="runtimes" link="/dashboard/runtimes" />
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <div className={styles.detailOuter}>
              <RuntimeCard detail={runtimeDetail} />
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
                />
                <Button className={styles.buttonRight} onClick={onRefresh}>
                  <Icon name="refresh" />
                </Button>
              </div>
              <Table columns={columns} dataSource={clusters.toJSON()} />
            </div>
            <ul />
            <Pagination onChange={changePagination} total={totalCount} current={currentPage} />
          </div>
        </div>
      </Layout>
    );
  }
}

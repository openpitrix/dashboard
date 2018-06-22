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
    await runtimeStore.fetch(runtimeId);
    await clusterStore.fetchAll({ runtime_id: runtimeId });
  }

  constructor(props) {
    super(props);
    this.runtimeId = props.match.params.runtimeId;
  }

  onSearch = async search_word => {
    await this.props.clusterStore.fetchAll({
      runtime_id: this.runtimeId,
      search_word
    });
  };

  onRefresh = async () => {
    const { clusterStore } = this.props;
    const { currentClusterPage } = this.props.runtimeStore;
    await clusterStore.fetchAll({ runtime_id: this.runtimeId, page: currentClusterPage });
  };

  onChangePage = async page => {
    const { clusterStore, runtimeStore } = this.props;
    runtimeStore.setClusterPage(page);
    await clusterStore.fetchAll({
      runtime_id: this.runtimeId,
      page
    });
  };

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
    const { clusters, totalCount } = clusterStore;

    const columns = [
      {
        title: 'Cluster Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, obj) => <TdName name={name} description={obj.description} />
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'App Version',
        dataIndex: 'latest_version',
        key: 'latest_version'
      },
      {
        title: 'Node Count',
        dataIndex: 'node_count',
        key: 'id'
      },
      {
        title: 'Runtime',
        dataIndex: 'runtime',
        key: 'runtime'
      },
      {
        title: 'User',
        dataIndex: 'user',
        key: 'user'
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
      <Layout>
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
                  onSearch={this.onSearch}
                />
                <Button className={styles.buttonRight} onClick={this.onRefresh}>
                  <Icon name="refresh" />
                </Button>
              </div>
              <Table columns={columns} dataSource={clusters.toJSON()} />
            </div>
            <ul />
            <Pagination onChange={this.onChangePage} total={totalCount} />
          </div>
        </div>
      </Layout>
    );
  }
}

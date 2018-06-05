import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';
import classNames from 'classnames';

import ManageTabs from 'components/ManageTabs';
import RuntimeCard from 'components/DetailCard/RuntimeCard';
import Button from 'components/Base/Button';
import Icon from 'components/Base/Icon';
import Input from 'components/Base/Input';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import Table from 'components/Base/Table';
import Pagination from 'components/Base/Pagination';
import TdName from 'components/TdName';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore,
  clusterStore: rootStore.clusterStore
}))
@observer
export default class RuntimeDetail extends Component {
  static async onEnter({ runtimeStore, clusterStore }, { runtimeId }) {
    await runtimeStore.fetchRuntimeDetail(runtimeId);
    await clusterStore.fetchClusters();
  }

  onSearch = async name => {
    await this.props.clusterStore.fetchQueryClusters(name);
  };

  onRefresh = async () => {
    await this.onSearch();
  };

  render() {
    const { runtimeStore, clusterStore } = this.props;
    const runtimeDetail = toJS(runtimeStore.runtimeDetail);
    const data = toJS(clusterStore.clusters);
    const fetchClusters = async current => {
      await clusterStore.fetchClusters(current);
    };

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
      <div className={styles.appDetail}>
        <ManageTabs />
        <div className={styles.backTo}>
          <Link to="/manage/runtimes">← Back to Runtimes</Link>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <RuntimeCard detail={runtimeDetail} />
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
              <Table columns={columns} dataSource={data} />
            </div>
            {clusterStore.totalCount > 0 && (
              <Pagination onChange={fetchClusters} total={clusterStore.totalCount} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

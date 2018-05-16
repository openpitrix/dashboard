import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import ManageTabs from 'components/ManageTabs';
import AppCard from 'components/DetailCard/AppCard';
import VersionList from 'components/VersionList';
import Icon from 'components/Base/Icon';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import Table from 'components/Base/Table';
import Pagination from 'components/Base/Pagination';
import TdName from 'components/TdName';
import { getParseDate } from 'utils';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  clusterStore: rootStore.clusterStore
}))
@observer
export default class AppDetail extends Component {
  static async onEnter({ appStore, clusterStore }, { appId }) {
    await appStore.fetchApp(appId);
    await appStore.fetchAppVersions(appId);
    await clusterStore.fetchClusters({ page: 1 });
  }

  onSearch = async name => {
    await this.props.clusterStore.fetchQueryClusters(name);
  };

  onRefresh = async () => {
    await this.onSearch();
  };

  render() {
    const { appStore, clusterStore } = this.props;
    const appDetail = toJS(appStore.app);
    const versions = toJS(appStore.versions);
    const fetchClusters = async current => {
      await clusterStore.fetchClusters({ page: current });
    };
    const data = toJS(clusterStore.clusters);
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
          <Link to="/manage/apps">← Back to Apps</Link>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <div className={styles.mb24}>
              <AppCard appDetail={appDetail} />
            </div>
            <VersionList versions={versions.slice(0, 4)} />
          </div>
          <div className={styles.rightInfo}>
            <div className={styles.wrapper2}>
              <TagNav tags={tags} curTag={curTag} />
              <div className={styles.toolbar}>
                <Input.Search
                  className={styles.search}
                  placeholder="Search & Filter"
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

import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';
import classNames from 'classnames';

import ManageTabs from 'components/ManageTabs';
import DetailCard from 'components/DetailCard';
import VersionList from 'components/VersionList';
import Icon from 'components/Base/Icon';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import Table from 'components/Base/Table';
import Pagination from 'components/Base/Pagination';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  clusterStore: rootStore.clusterStore
}))
@observer
export default class AppDetail extends Component {
  static async onEnter({ clusterStore }) {
    await clusterStore.fetchClusters();
  }

  render() {
    const { clusterStore } = this.props;
    const data = toJS(clusterStore.clusters.items) || [];
    const columns = [
      {
        title: 'Cluster Name',
        dataIndex: 'name',
        key: 'name',
        width: '15%'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '12%',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'App Version',
        dataIndex: 'latest_version',
        key: 'latest_version',
        width: '10%'
      },
      {
        title: 'Node Count',
        dataIndex: 'node_count',
        key: 'node_count',
        width: '10%'
      },
      {
        title: 'Runtime',
        dataIndex: 'runtime',
        key: 'runtime',
        width: '8%'
      },
      {
        title: 'User',
        dataIndex: 'user',
        key: 'user',
        width: '8%'
      },
      {
        title: 'User',
        dataIndex: 'node_count',
        key: 'node_count',
        width: '8%'
      },
      {
        title: 'Date Created',
        dataIndex: 'created',
        key: 'created',
        width: '7%',
        render: getParseDate
      }
    ];
    const tags = [{ id: 1, name: 'Apps', link: '/manage/apps/22', current: true }];
    return (
      <div className={styles.appDetail}>
        <ManageTabs />
        <div className={styles.backTo}>
          <Link to="/manage/apps">← Back to Apps</Link>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <div className={styles.mb24}>
              <DetailCard />
            </div>
            <VersionList />
          </div>
          <div className={styles.rightInfo}>
            <div className={styles.wrapper2}>
              <TagNav tags={tags} />
              <div className={styles.toolbar}>
                <Input.Search className={styles.search} placeholder="Search App Name" />
                <Button className={styles.buttonRight}>
                  <Icon name="refresh" />
                </Button>
              </div>
              <Table className={styles.tableOuter} columns={columns} dataSource={data} />
            </div>
            <Pagination />
          </div>
        </div>
      </div>
    );
  }
}

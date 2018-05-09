import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { getParseDate } from 'utils';

import ManageTabs from 'components/ManageTabs';
import Statistics from 'components/Statistics';
import Icon from 'components/Base/Icon';
import Input from 'components/Base/Input';
import Button from 'components/Base/Button';
import Status from 'components/Status';
import Table from 'components/Base/Table';
import Pagination from 'components/Base/Pagination';
import preload from 'hoc/preload';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  clusterStore: rootStore.clusterStore
}))
@observer
@preload('fetchClusters')
export default class Clusters extends Component {
  render() {
    const { clusterStore } = this.props;
    const { image, name, total1, centerName, total2, progress, total3, histogram } = {
      image: 'http://via.placeholder.com/24x24',
      name: 'Clusters',
      total1: 430,
      centerName: 'Runtimes',
      total2: 4,
      progress: [10, 20, 70],
      total3: 32,
      histogram: [10, 20, 30, 80, 5, 60, 56, 10, 20, 30, 80, 5, 60, 56]
    };

    const data = toJS(clusterStore.clusters) || [];
    const columns = [
      {
        title: 'Cluster ID',
        dataIndex: 'id',
        key: 'id',
        render: text => (
          <Link className={classNames(styles.idLink, 'id')} to={`/manage/cluster/${text}`}>
            {text}
          </Link>
        )
      },
      {
        title: 'Cluster Name',
        dataIndex: 'cluster_name',
        key: 'cluster_name'
      },
      {
        title: 'App Name',
        dataIndex: 'app_name',
        key: 'app_name'
      },
      {
        title: 'App Version',
        dataIndex: 'app_version',
        key: 'app_version'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Node Count',
        dataIndex: 'node_count',
        key: 'node_count'
      },
      {
        title: 'Date Created',
        dataIndex: 'created',
        key: 'created',
        render: getParseDate
      }
    ];

    return (
      <div className={styles.apps}>
        <ManageTabs />
        <Statistics
          className={styles.stat}
          image={image}
          name={name}
          total1={total1}
          centerName={centerName}
          total2={total2}
          progress={progress}
          total3={total3}
          histogram={histogram}
        />
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.toolbar}>
              <Input.Search className={styles.search} placeholder="Search Cluster ID or App Name" />
              <Button className={styles.refresh}>
                <Icon name="refresh" />
              </Button>
            </div>

            <Table className={styles.tableOuter} columns={columns} dataSource={data} />
          </div>

          <Pagination />
        </div>
      </div>
    );
  }
}

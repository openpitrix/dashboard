import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { getParseDate } from 'utils';

import Icon from 'components/Base/Icon';
import Input from 'components/Base/Input';
import Button from 'components/Base/Button';
import Select from 'components/Base/Select';
import Status from 'components/Status';
import Table from 'components/Base/Table';
import Pagination from 'components/Base/Pagination';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  clusterStore: rootStore.clusterStore
}))
@observer
export default class Clusters extends Component {
  static async onEnter({ clusterStore }) {
    await clusterStore.fetchAll();
  }

  render() {
    const { clusterStore } = this.props;

    const data = clusterStore.clusters.toJSON();
    const columns = [
      {
        title: 'Cluster ID',
        dataIndex: 'id',
        key: 'id',
        width: '13%',
        render: text => (
          <Link className={classNames(styles.idLink, 'id')} to={`/dashboard/cluster/${text}`}>
            {text}
          </Link>
        )
      },
      {
        title: 'Cluster Name',
        dataIndex: 'cluster_name',
        key: 'cluster_name',
        width: '15%'
      },
      {
        title: 'App Name',
        dataIndex: 'app_name',
        key: 'app_name',
        width: '15%'
      },
      {
        title: 'App Version',
        dataIndex: 'app_version',
        key: 'app_version',
        width: '20%'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '12%',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Node Count',
        dataIndex: 'node_count',
        key: 'node_count',
        width: '12%'
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
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.toolbar}>
              <Button className={styles.refresh}>
                <Icon name="refresh" />
              </Button>
              <Select className={styles.select} value="All Types">
                <Select.Option value="1">Types1</Select.Option>
                <Select.Option value="2">Types2</Select.Option>
              </Select>
              <Input.Search className={styles.search} placeholder="Search Cluster ID or App Name" />
            </div>

            <Table columns={columns} dataSource={data} />
          </div>

          <Pagination />
        </div>
      </div>
    );
  }
}

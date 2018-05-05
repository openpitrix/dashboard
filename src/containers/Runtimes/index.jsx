import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { getParseDate } from 'utils';
import classNames from 'classnames';

import ManageTabs from 'components/ManageTabs';
import Statistics from 'components/Statistics';
import Icon from 'components/Base/Icon';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Select from 'components/Base/Select';
import Status from 'components/Status';
import TdName from 'components/TdName';
import Table from 'components/Base/Table';
import Pagination from 'components/Base/Pagination';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  appStore: rootStore.appStore
}))
@observer
export default class Runtimes extends Component {
  static async onEnter({ appStore }) {
    await appStore.fetchInstalledApps();
  }

  renderHandleMenu = id => (
    <div id={id} className="operate-menu">
      <span>View app cluster</span>
      <span>Delete app</span>
    </div>
  );

  render() {
    const { appStore } = this.props;
    const { image, name, total1, centerName, total2, progress, total3, histogram } = {
      image: 'http://via.placeholder.com/30x24',
      name: 'Runtimes',
      total1: 192,
      centerName: 'Provider',
      total2: 5,
      progress: [10, 20, 30, 40],
      total3: 40,
      histogram: [10, 20, 30, 80, 5, 60, 56, 10, 20, 30, 80, 5, 60, 56]
    };
    const data = toJS(appStore.installedApps.items) || [];
    const columns = [
      {
        title: 'Runtime Name',
        dataIndex: 'name',
        key: 'name',
        width: '10%',
        render: text => <TdName name={text} description={text} />
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Provider',
        dataIndex: 'provider',
        key: 'provider',
        width: '8%'
      },
      {
        title: 'Zone/Namspace',
        dataIndex: 'Zone_Namspace',
        key: 'Zone_Namspace',
        width: '6%'
      },
      {
        title: 'Cluster Count',
        dataIndex: 'cluster_count',
        key: 'cluster_count',
        width: '12%'
      },
      {
        title: 'User',
        dataIndex: 'user',
        key: 'user',
        width: '8%'
      },
      {
        title: 'Updated At',
        dataIndex: 'last_modified',
        key: 'last_modified',
        width: '10%',
        render: getParseDate
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        width: '3%'
      }
    ];

    return (
      <div className={styles.apps}>
        <ManageTabs />
        <div className={styles.stat}>
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
        </div>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.toolbar}>
              <Select className={styles.select} value="All Types">
                <Select.Option value="1">Types1</Select.Option>
                <Select.Option value="2">Types2</Select.Option>
              </Select>
              <Input.Search className={styles.search} placeholder="Search App Name" />
              <Button className={classNames(styles.buttonRight, styles.ml12)} type="primary">
                Create
              </Button>
              <Button className={styles.buttonRight}>
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

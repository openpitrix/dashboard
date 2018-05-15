import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { getParseDate } from 'utils';
import classNames from 'classnames';

import ManageTabs from 'components/ManageTabs';
import Statistics from 'components/Statistics';
import Icon from 'components/Base/Icon';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Status from 'components/Status';
import Popover from 'components/Base/Popover';
import TdName from 'components/TdName';
import Table from 'components/Base/Table';
import Pagination from 'components/Base/Pagination';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore
}))
@observer
export default class Runtimes extends Component {
  static async onEnter({ runtimeStore }) {
    await runtimeStore.fetchRuntimes({ page: 1 });
  }

  onSearch = async name => {
    await this.props.runtimeStore.fetchQueryRuntimes(name);
  };

  onRefresh = async () => {
    await this.onSearch();
  };

  renderHandleMenu = id => (
    <div id={id} className="operate-menu">
      <Link to={`/manage/runtimes/${id}`}>View runtime detail</Link>
      <span>Delete runtime</span>
    </div>
  );

  render() {
    const { runtimeStore } = this.props;
    const data = toJS(runtimeStore.runtimes);
    const { image, name, total, centerName, progressTotal, progress, lastedTotal, histograms } = {
      image: 'http://via.placeholder.com/30x24',
      name: 'Runtimes',
      total: 198,
      centerName: 'Provider',
      progressTotal: 5,
      progress: [10, 20, 30, 40],
      lastedTotal: 66,
      histograms: [10, 20, 30, 80, 5, 60, 56, 10, 20, 30, 80, 5, 60, 56]
    };
    const columns = [
      {
        title: 'Runtime Name',
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
        title: 'Provider',
        dataIndex: 'provider',
        key: 'provider'
      },
      {
        title: 'Zone/Namspace',
        dataIndex: 'zone',
        key: 'zone'
      },
      {
        title: 'Cluster Count',
        dataIndex: 'node_count',
        key: 'node_count'
      },
      {
        title: 'User',
        dataIndex: 'owner',
        key: 'owner'
      },
      {
        title: 'Updated At',
        dataIndex: 'status_time',
        key: 'status_time',
        width: '10%',
        render: getParseDate
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (text, item) => (
          <div className={styles.handlePop}>
            <Popover content={this.renderHandleMenu(item.runtime_id)}>
              <Icon name="more" />
            </Popover>
          </div>
        )
      }
    ];

    return (
      <div className={styles.apps}>
        <ManageTabs />
        <Statistics
          image={image}
          name={name}
          total={total}
          centerName={centerName}
          progressTotal={progressTotal}
          progress={progress}
          lastedTotal={lastedTotal}
          histograms={histograms}
        />
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.toolbar}>
              <Input.Search
                className={styles.search}
                placeholder="Search Runtimes Name"
                onSearch={this.onSearch}
              />
              <Button className={classNames(styles.buttonRight, styles.ml12)} type="primary">
                Create
              </Button>
              <Button className={styles.buttonRight} onClick={this.onRefresh}>
                <Icon name="refresh" />
              </Button>
            </div>

            <Table className={styles.tableOuter} columns={columns} dataSource={data} />
          </div>
          {runtimeStore.totalCount > 0 && (
            <Pagination onChange={runtimeStore.fetchRuntimes} total={runtimeStore.totalCount} />
          )}
        </div>
      </div>
    );
  }
}

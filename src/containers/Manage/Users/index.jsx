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
import Table from 'components/Base/Table';
import Pagination from 'components/Base/Pagination';
import TdName from 'components/TdName';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  userStore: rootStore.userStore
}))
@observer
export default class Users extends Component {
  static async onEnter({ userStore }) {
    await userStore.fetchUsers({ page: 1 });
  }
  render() {
    const { userStore } = this.props;
    const { image, name, total, centerName, progressTotal, progress, lastedTotal, histograms } = {
      image: 'http://via.placeholder.com/24x24',
      name: 'Users',
      total: 192,
      centerName: 'Roles',
      progressTotal: 5,
      progress: [10, 20, 60, 10],
      lastedTotal: 40,
      histograms: [10, 20, 30, 80, 5, 60, 56, 10, 20, 30, 80, 5, 60, 56]
    };
    const data = toJS(userStore.users);
    const columns = [
      {
        title: 'UserName',
        dataIndex: 'username',
        key: 'username',
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
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: '8%'
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        width: '6%'
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
      <div className={styles.users}>
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

import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';
import classNames from 'classnames';

import ManageTabs from 'components/ManageTabs';
import Statistics from 'components/Statistics';
import Icon from 'components/Base/Icon';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Select from 'components/Base/Select';
import Popover from 'components/Base/Popover';
import Status from 'components/Status';
import Table from 'components/Base/Table';
import Pagination from 'components/Base/Pagination';
import styles from './index.scss';
import PropTypes from 'prop-types';

export default class AppsTable extends Component {
  static propTypes = {
    className: PropTypes.string
  };

  renderHandleMenu = id => (
    <div id={id} className="operate-menu">
      <span>View app cluster</span>
      <span>Delete app</span>
    </div>
  );

  render() {
    const { apps, className } = this.props;
    console.log('dongrui' + apps);
    const data = toJS(apps) || [];
    const columns = [
      {
        title: 'App Name11',
        dataIndex: 'name',
        key: 'name',
        width: '10%'
      },
      {
        title: 'Latest Version',
        dataIndex: 'latest_version',
        key: 'latest_version',
        width: '12%'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Categories',
        dataIndex: 'categories',
        key: 'categories',
        width: '8%'
      },
      {
        title: 'Visibility',
        dataIndex: 'visibility',
        key: 'visibility',
        width: '6%'
      },
      {
        title: 'Repo',
        dataIndex: 'repo_id',
        key: 'repo_id',
        width: '12%'
      },
      {
        title: 'Developer',
        dataIndex: 'developer',
        key: 'developer',
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
        <div className={styles.stat}>
          <Statistics className={styles.stat} />
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

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import { Table } from 'components/Base';
import Layout from 'components/Layout';
import Status from 'components/Status';
import AppName from 'components/AppName';
import TimeShow from 'components/TimeShow';
import { getObjName, mappingStatus } from 'utils';

import styles from './index.scss';

const types = [
  { name: 'Unprocessed', value: 'unprocessed' },
  { name: 'Processed', value: 'processed' }
];

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore,
  userStore: rootStore.userStore,
  user: rootStore.user
}))
@observer
export default class Reviews extends Component {
  async componentDidMount() {
    const { appVersionStore } = this.props;

    await appVersionStore.fetchReviews();
  }

  componentWillUnmount() {
    const { appVersionStore } = this.props;
    appVersionStore.reset();
  }

  changeType = type => {
    const { appVersionStore } = this.props;
    if (type !== appVersionStore.activeType) {
      appVersionStore.activeType = type;
      appVersionStore.fetchReviews();
    }
  };

  render() {
    const {
      appVersionStore, appStore, userStore, t
    } = this.props;
    const { reviews, isLoading, activeType } = appVersionStore;
    const { apps } = appStore;
    const { users } = userStore;

    const columns = [
      {
        title: t('Number'),
        key: 'review_id',
        width: '100px',
        render: item => (
          <Link to={`/dashboard/app-review/${item.review_id}`}>
            {item.review_id}
          </Link>
        )
      },
      {
        title: t('Apply Type'),
        key: 'apply_type',
        width: '70px',
        render: item => item.apply_type || t('App on the shelf')
      },
      {
        title: t('App Info'),
        key: 'appName',
        width: '130px',
        render: item => (
          <AppName
            linkUrl={`/dashboard/app/${item.app_id}`}
            icon={getObjName(apps, 'app_id', item.app_id, 'icon')}
            name={getObjName(apps, 'app_id', item.app_id, 'name')}
            versionName={item.version_name}
          />
        )
      },
      {
        title: t('Submitter'),
        key: 'developer',
        width: '80px',
        render: item => getObjName(users, 'user_id', item.owner, 'username') || item.owner
      },
      {
        title: t('Submit time'),
        key: 'status_time',
        width: '130px',
        render: item => <TimeShow time={item.status_time} type="detailTime" />
      },
      {
        title: t('Audit status'),
        key: 'status',
        width: '100px',
        render: item => (
          <Status type={item.status} name={mappingStatus(item.status)} />
        )
      }
    ];

    const filterList = [
      {
        key: 'status',
        conditions: [
          { name: t('Submitted'), value: 'submitted' },
          { name: t('Passed'), value: 'passed' },
          { name: t('Rejected'), value: 'rejected' },
          { name: t(mappingStatus('Active')), value: 'active' },
          { name: t(mappingStatus('Suspended')), value: 'suspended' }
        ],
        onChangeFilter: appVersionStore.onChangeStatus,
        selectValue: appVersionStore.selectStatus
      }
    ];

    const pagination = {
      tableType: 'Apps',
      onChange: appVersionStore.changePagination,
      total: appVersionStore.totalCount,
      current: appVersionStore.currentPage,
      noCancel: false
    };

    return (
      <Layout pageTitle={t('App Reviews')}>
        <div className={styles.types}>
          {types.map(type => (
            <label
              key={type.value}
              onClick={() => this.changeType(type.value)}
              className={classnames({
                [styles.active]: activeType === type.value
              })}
            >
              {t(type.name)}
            </label>
          ))}
        </div>
        <Table
          columns={columns}
          dataSource={reviews.toJSON()}
          filterList={filterList}
          pagination={pagination}
          isLoading={isLoading}
        />
      </Layout>
    );
  }
}

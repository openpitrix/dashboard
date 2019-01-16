import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import { Table, Button } from 'components/Base';
import Layout from 'components/Layout';
import Status from 'components/Status';
import AppName from 'components/AppName';
import TableTypes from 'components/TableTypes';
import { formatTime, getObjName, mappingStatus } from 'utils';

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
      appVersionStore, appStore, user, t
    } = this.props;
    const { reviews, isLoading, activeType } = appVersionStore;
    const { apps } = appStore;

    const columns = [
      {
        title: t('Number'),
        key: 'review_id',
        width: '120px',
        className: 'number',
        render: item => (
          <Link to={`/dashboard/app-review/${item.review_id}`}>
            {item.review_id}
          </Link>
        )
      },
      {
        title: t('Audit type'),
        key: 'apply_type',
        width: '80px',
        render: item => item.apply_type || t('App on the shelf')
      },
      {
        title: t('App Info'),
        key: 'appName',
        width: '150px',
        render: item => (
          <AppName
            linkUrl={`/dashboard/app/${item.app_id}`}
            icon={getObjName(apps, 'app_id', item.app_id, 'icon')}
            name={getObjName(apps, 'app_id', item.app_id, 'name')}
            versionName={item.version_name}
            type={item.version_type || 'VM'}
          />
        )
      },
      {
        title: t('Submitter'),
        key: 'submitter',
        width: '150px',
        render: item => item.submitter
      },
      {
        title: t('Submit time'),
        key: 'status_time',
        width: '120px',
        className: 'time',
        render: item => formatTime(item.status_time, 'YYYY/MM/DD HH:mm:ss')
      },
      {
        title: t('Audit status'),
        key: 'status',
        width: '100px',
        render: item => (
          <Status type={item.status} name={mappingStatus(item.status)} />
        )
      },
      {
        title: t('Auditor'),
        key: 'actions',
        width: '80px',
        className: 'actions',
        render: item => (
          <Link to={`/dashboard/app-review/${item.review_id}`}>
            <Button>{t('Start process')}</Button>
          </Link>
        )
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
      <Layout pageTitle={t('App Reviews')} className={styles.reviewList}>
        <TableTypes
          types={types}
          activeType={activeType}
          changeType={this.changeType}
        />
        <Table
          columns={columns}
          dataSource={reviews.toJSON()}
          pagination={pagination}
          isLoading={isLoading}
        />
      </Layout>
    );
  }
}

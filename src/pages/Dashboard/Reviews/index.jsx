import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import { Table, Button } from 'components/Base';
import Layout from 'components/Layout';
import Status from 'components/Status';
import AppName from 'components/AppName';
import TableTypes from 'components/TableTypes';
import { formatTime, getObjName } from 'utils';
import { reviewShowStatus } from 'config/version';
import routes, { toRoute } from 'routes';

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

    await appVersionStore.setReviewTypes();
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

  handleReview = async item => {
    const { appVersionStore, history } = this.props;
    const isReviewed = item.status.indexOf('in-review') > -1;

    if (!isReviewed) {
      await appVersionStore.versionReview({
        handleType: 'review',
        versionId: item.version_id,
        currentStatus: item.status,
        noTips: true
      });
    }

    history.push(
      toRoute(routes.portal.appReviewDetail, {
        reviewId: item.review_id
      })
    );
  };

  render() {
    const { appVersionStore, appStore, t } = this.props;
    const { reviews, isLoading, activeType } = appVersionStore;
    const { apps } = appStore;
    const isUnprocessed = activeType === 'unprocessed';
    const linkReview = reviewId => toRoute(routes.portal.appReviewDetail, {
      reviewId
    });

    const columns = [
      {
        title: t('Number'),
        key: 'review_id',
        width: '120px',
        className: 'number',
        render: item => (
          <div>
            {isUnprocessed ? (
              <Link onClick={() => this.handleReview(item)} to="#">
                {item.review_id}
              </Link>
            ) : (
              <Link to={linkReview(item.review_id)}>{item.review_id}</Link>
            )}
          </div>
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
            linkUrl={toRoute(routes.portal.appDetail, { appId: item.app_id })}
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
        title: t('Audit status'),
        key: 'status',
        width: '100px',
        render: item => (
          <Status
            type={reviewShowStatus[item.status] || item.status}
            name={reviewShowStatus[item.status] || item.status}
          />
        )
      },
      {
        title: t('Submit time'),
        key: 'status_time',
        width: '120px',
        className: 'time',
        render: item => formatTime(item.status_time, 'YYYY/MM/DD HH:mm:ss')
      },
      {
        title: isUnprocessed ? t('Auditor') : '',
        key: 'actions',
        width: '75px',
        className: 'actions',
        render: item => (
          <div>
            {isUnprocessed ? (
              <Button onClick={() => this.handleReview(item)}>
                {t('Start process')}
              </Button>
            ) : (
              <Link to={linkReview(item.review_id)}>
                <span>{t('View detail')} →</span>
              </Link>
            )}
          </div>
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
      <Layout pageTitle={t('App Reviews')}>
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

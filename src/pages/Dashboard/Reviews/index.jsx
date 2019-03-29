import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import { Table, Button } from 'components/Base';
import Layout from 'components/Layout';
import Status from 'components/Status';
import AppName from 'components/AppName';
import TableTypes from 'components/TableTypes';
import TdUser from 'components/TdUser';
import { formatTime, getObjName } from 'utils';
import { reviewShowStatus } from 'config/version';
import routes, { toRoute } from 'routes';
import { setPage } from 'mixins';

import styles from './index.scss';

const types = [
  { name: 'Unprocessed', value: 'unprocessed' },
  { name: 'Processed', value: 'processed' }
];

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore,
  userStore: rootStore.userStore,
  user: rootStore.user
}))
@setPage('appVersionStore')
@observer
export default class Reviews extends Component {
  async componentDidMount() {
    const { appVersionStore } = this.props;

    await appVersionStore.setReviewTypes();
    await appVersionStore.fetchReviews();
  }

  componentWillUnmount() {
    const { appStore, appVersionStore } = this.props;
    appVersionStore.reset();
    appStore.reset();
  }

  changeType = type => {
    const { appVersionStore } = this.props;
    if (type !== appVersionStore.activeType) {
      appVersionStore.activeType = type;
      appVersionStore.fetchReviews();
      appVersionStore.changeActiveType(type);
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

  renderSubmitter(id) {
    const { user, appStore, userStore } = this.props;
    const { apps } = appStore;
    const app = _.find(apps, { app_id: id }) || {};

    if (user.isISV) {
      return <TdUser users={userStore.users} userId={id} />;
    }

    return <div className={styles.submitter}>{app.company_name}</div>;
  }

  render() {
    const {
      appVersionStore, appStore, userStore, user, t
    } = this.props;
    const { reviews, isLoading, activeType } = appVersionStore;
    const { apps } = appStore;
    const { users } = userStore;
    const isUnprocessed = activeType === 'unprocessed';
    const linkReview = reviewId => toRoute(routes.portal.appReviewDetail, {
      reviewId
    });

    let columns = [
      {
        title: t('Number'),
        key: 'review_id',
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
        render: item => item.apply_type || t('App on the shelf')
      },
      {
        title: t('App Info'),
        key: 'appName',
        render: item => (
          <AppName
            linkUrl={toRoute(routes.portal.appDetail, { appId: item.app_id })}
            icon={getObjName(apps, 'app_id', item.app_id, 'icon')}
            name={item.app_name}
            versionName={item.version_name}
            type={item.version_type}
          />
        )
      },
      {
        title: t('Submitter'),
        key: 'submitter',
        render: item => this.renderSubmitter(
          user.isISV ? _.get(item, 'phase.developer.operator') : item.app_id
        )
      },
      {
        title: isUnprocessed ? t('Audit status') : t('Review result'),
        key: 'status',
        render: item => (
          <Status
            type={reviewShowStatus[item.status] || item.status}
            name={reviewShowStatus[item.status] || item.status}
          />
        )
      },
      {
        title: t('Operator'),
        key: 'operator',
        className: 'boldFont',
        render: item => <TdUser users={users} userId={item.reviewer} />
      },
      {
        title: isUnprocessed ? t('Submit time') : t('Update time'),
        key: 'status_time',
        className: 'time',
        render: item => formatTime(item.status_time, 'YYYY/MM/DD HH:mm:ss')
      },
      {
        title: isUnprocessed ? t('Actions') : '',
        key: 'actions',
        width: '110px',
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

    if (isUnprocessed) {
      columns = columns.filter(item => item.key !== 'operator');
    }

    const pagination = {
      tableType: 'Apps',
      onChange: appVersionStore.changeReviewPagination,
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

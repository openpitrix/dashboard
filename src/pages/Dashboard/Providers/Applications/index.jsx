import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import { Table, Button } from 'components/Base';
import Layout from 'components/Layout';
import Status from 'components/Status';
import TableTypes from 'components/TableTypes';
import TdUser from 'components/TdUser';
import { formatTime } from 'utils';
import routes, { toRoute } from 'routes';
import { setPage } from 'mixins';

import styles from './index.scss';

const types = [
  { name: 'Unreviewed', value: 'unreviewed', status: ['submitted'] },
  { name: 'Reviewed', value: 'reviewed', status: ['rejected', 'passed'] }
];

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  user: rootStore.user,
  userStore: rootStore.userStore,
  vendorStore: rootStore.vendorStore
}))
@setPage('vendorStore')
@observer
export default class Applications extends Component {
  async componentDidMount() {
    const { vendorStore } = this.props;
    await vendorStore.fetchAll({ status: 'submitted' });
  }

  componentWillUnmount() {
    const { vendorStore } = this.props;
    vendorStore.reset();
  }

  changeType = async type => {
    const { vendorStore } = this.props;

    if (type !== vendorStore.activeType) {
      vendorStore.activeType = type;
      const typeMap = _.find(types, { value: type });
      await vendorStore.fetchAll({ status: typeMap.status });
      vendorStore.changeActiveType(type);
    }
  };

  render() {
    const {
      vendorStore, userStore, user, t
    } = this.props;
    const { vendors, activeType, isLoading } = vendorStore;
    const { users } = userStore;
    const isUnreviewed = activeType === 'unreviewed';

    const linkUrl = id => toRoute(routes.portal._admin.providerApplyDetail, { applyId: id });
    let columns = [
      {
        title: t('Apply No'),
        key: 'number',
        width: '135px',
        className: 'number',
        render: item => <Link to={linkUrl(item.user_id)}>{item.user_id}</Link>
      },
      {
        title: t('Review result'),
        key: 'status',
        width: '90px',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: t('Company name, introduction'),
        key: 'company',
        width: '200px',
        render: item => (
          <div className={styles.company}>
            <div className={styles.name}>
              <Link to={linkUrl(item.user_id)}>{item.company_name}</Link>
            </div>
            <div className={styles.introduce}>{item.company_profile}</div>
          </div>
        )
      },
      {
        title: t('Company website'),
        key: 'home',
        width: '150px',
        className: 'textCut',
        render: item => item.company_website
      },
      {
        title: isUnreviewed ? t('Apply time') : t('Review time'),
        key: 'review_time',
        width: '100px',
        className: 'time',
        render: item => formatTime(item.submit_time)
      },
      {
        title: t('Auditor'),
        key: 'auditor',
        width: '130px',
        render: item => <TdUser userId={item.approver} users={users} />
      },
      {
        title: isUnreviewed ? t('Auditor') : '',
        key: 'actions',
        width: user.isEnglish ? '110px' : '80px',
        className: 'actions',
        render: item => (
          <div>
            <Link to={linkUrl(item.user_id)}>
              {isUnreviewed ? (
                <Button>{t('Start process')}</Button>
              ) : (
                <span>{t('View detail')} →</span>
              )}
            </Link>
          </div>
        )
      }
    ];

    if (isUnreviewed) {
      columns = columns.filter(item => item.key !== 'auditor');
    }

    const pagination = {
      tableType: 'shield',
      total: vendorStore.totalCount,
      current: vendorStore.currentPage,
      onChange: vendorStore.changeApplyPagination
    };

    return (
      <Layout pageTitle={t('Apply for Residence')} className={styles.applyList}>
        <TableTypes
          types={types}
          activeType={activeType}
          changeType={this.changeType}
        />

        <Table
          isLoading={isLoading}
          columns={columns}
          dataSource={vendors.toJSON()}
          pagination={pagination}
        />
      </Layout>
    );
  }
}

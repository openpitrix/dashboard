import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import _ from 'lodash';

import { Table } from 'components/Base';
import Layout from 'components/Layout';
import Status from 'components/Status';
import TableTypes from 'components/TableTypes';

import styles from './index.scss';

const types = [
  { name: 'Unreviewed', value: 'unreviewed', status: ['submitted'] },
  { name: 'Reviewed', value: 'reviewed', status: ['rejected', 'passed'] }
];

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  user: rootStore.user,
  vendorStore: rootStore.vendorStore
}))
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
    }
  };

  render() {
    const { vendorStore, user, t } = this.props;
    const { vendors, activeType } = vendorStore;

    const columns = [
      {
        title: t('申请编号'),
        key: 'number',
        width: '80px',
        render: item => (
          <Link to={`/dashboard/application/${item.user_id}`}>
            {item.user_id}
          </Link>
        )
      },
      {
        title: t('审核结果'),
        key: 'status',
        width: '80px',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: t('公司名称、介绍'),
        key: 'company',
        width: '200px',
        render: item => (
          <div className={styles.company}>
            <div className={styles.name}>{item.company_name}</div>
            <div className={styles.introduce}>{item.company_profile}</div>
          </div>
        )
      },
      {
        title: t('公司官网'),
        key: 'home',
        width: '120px',
        render: item => item.company_website
      },
      {
        title: t('审核时间'),
        key: 'audit_time',
        width: '100px',
        render: item => item.submit_time
      },
      {
        title: t('审核人员'),
        key: 'auditor',
        width: '120px',
        render: () => user.username
      },
      {
        title: '',
        key: 'actions',
        width: '80px',
        className: 'actions',
        render: item => (
          <div className={styles.actions}>
            <Link to={`/dashboard/application/${item.user_id}`}>
              {t('查看详情')} →
            </Link>
          </div>
        )
      }
    ];

    const pagination = {
      tableType: 'Apps',
      total: vendorStore.totalCount,
      current: vendorStore.currentPage,
      onChange: vendorStore.changeApplyPagination
    };

    return (
      <Layout pageTitle={t('入驻申请')}>
        <TableTypes
          types={types}
          activeType={activeType}
          changeType={this.changeType}
        />

        <Table
          columns={columns}
          dataSource={vendors.toJSON()}
          pagination={pagination}
        />
      </Layout>
    );
  }
}

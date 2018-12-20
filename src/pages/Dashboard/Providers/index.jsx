import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import { Table } from 'components/Base';
import Layout from 'components/Layout';

import providers from './mock/providers';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore
}))
@observer
export default class Providers extends Component {
  async componentDidMount() {}

  renderTitleSearch() {
    const { t } = this.props;

    return <div> 1111</div>;
  }

  render() {
    const { t } = this.props;

    const columns = [
      {
        title: t('编号'),
        key: 'number',
        width: '80px',
        render: item => (
          <Link to={`/dashboard/provider/${item.number}`}>{item.number}</Link>
        )
      },
      {
        title: t('公司名称'),
        key: 'company',
        width: '200px',
        render: item => item.company
      },
      {
        title: t('已上架应用'),
        key: 'app_total',
        width: '100px',
        render: item => item.app_total
      },
      {
        title: t('本月部署次数'),
        key: 'moth_count',
        width: '80px',
        render: item => item.moth_count
      },
      {
        title: t('总部署次数'),
        key: 'total_count',
        width: '80px',
        render: item => item.total_count
      },
      {
        title: '',
        key: 'actions',
        width: '80px',
        className: 'actions',
        render: item => (
          <div className={styles.actions}>
            <Link to={`/dashboard/provider/${item.number}`}>
              {t('查看详情')} →
            </Link>
          </div>
        )
      }
    ];

    const pagination = {
      total: 6,
      current: 1
    };

    return (
      <Layout pageTitle={t('全部服务商')}>
        <Table
          columns={columns}
          dataSource={providers}
          pagination={pagination}
        />
      </Layout>
    );
  }
}

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import { Table } from 'components/Base';
import Layout from 'components/Layout';
import TitleSearch from 'components/TitleSearch';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  vendorStore: rootStore.vendorStore
}))
@observer
export default class Providers extends Component {
  async componentDidMount() {
    const { vendorStore } = this.props;
    await vendorStore.fetchAll();
  }

  componentWillUnmount() {
    const { vendorStore } = this.props;
    vendorStore.reset();
  }

  render() {
    const { vendorStore, t } = this.props;

    const columns = [
      {
        title: t('Number'),
        key: 'number',
        width: '80px',
        render: item => (
          <Link to={`/dashboard/provider/${item.user_id}`}>{item.user_id}</Link>
        )
      },
      {
        title: t('Company name'),
        key: 'company',
        width: '200px',
        render: item => item.company_name
      },
      {
        title: t('On the shelf apps'),
        key: 'app_total',
        width: '100px',
        render: item => item.app_total || 0
      },
      {
        title: t('Deploy times this month'),
        key: 'moth_count',
        width: '80px',
        render: item => item.moth_count || 0
      },
      {
        title: t('Total of deploy'),
        key: 'total_count',
        width: '80px',
        render: item => item.total_count || 0
      },
      {
        title: '',
        key: 'actions',
        width: '80px',
        className: 'actions',
        render: item => (
          <div className={styles.actions}>
            <Link to={`/dashboard/provider/${item.user_id}`}>
              {t('View detail')} →
            </Link>
          </div>
        )
      }
    ];

    const {
      vendors, searchWord, onSearch, onClearSearch
    } = vendorStore;

    const pagination = {
      tableType: 'Apps',
      total: vendorStore.totalCount,
      current: vendorStore.currentPage,
      onChange: vendorStore.changePagination
    };

    return (
      <Layout>
        <TitleSearch
          title={t('All Providers')}
          placeholder={t('Search App')}
          searchWord={searchWord}
          onSearch={onSearch}
          onClear={onClearSearch}
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

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import Table from 'components/EnhanceTable';
import Layout from 'components/Layout';
import TitleSearch from 'components/TitleSearch';
import { formatTime } from 'utils';
import routes, { toRoute } from 'routes';
import { setPage } from 'mixins';

import styles from './index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  vendorStore: rootStore.vendorStore
}))
@setPage('vendorStore')
@observer
export default class Providers extends Component {
  async componentDidMount() {
    const { vendorStore } = this.props;
    vendorStore.attchStatictics = true;
    await vendorStore.fetchAll();
  }

  componentWillUnmount() {
    const { vendorStore } = this.props;
    vendorStore.reset();
  }

  render() {
    const { vendorStore, t } = this.props;
    const {
      vendors,
      statistics,
      searchWord,
      onSearch,
      onClear,
      isLoading
    } = vendorStore;
    const linkUrl = id => toRoute(routes.portal._admin.providerDetail, { providerId: id });
    const columns = [
      {
        title: t('Number'),
        key: 'number',
        width: '120px',
        className: 'number',
        render: item => <Link to={linkUrl(item.user_id)}>{item.user_id}</Link>
      },
      {
        title: t('Company name'),
        key: 'company',
        width: '180px',
        className: 'fold',
        render: item => (
          <Link to={linkUrl(item.user_id)}>{item.company_name}</Link>
        )
      },
      {
        title: t('On the shelf apps'),
        key: 'active_app_count',
        width: '100px',
        className: 'fold',
        render: item => (_.find(statistics, { user_id: item.user_id }) || {})
          .active_app_count || 0
      },
      {
        title: t('Deploy times this month'),
        key: 'cluster_count_month',
        width: '80px',
        className: 'fold',
        render: item => (_.find(statistics, { user_id: item.user_id }) || {})
          .cluster_count_month || 0
      },
      {
        title: t('Total of deploy'),
        key: 'cluster_count_total',
        width: '80px',
        className: 'fold',
        render: item => (_.find(statistics, { user_id: item.user_id }) || {})
          .cluster_count_total || 0
      },
      {
        title: t('Time of entry'),
        key: 'status_time',
        width: '100px',
        className: 'time',
        render: item => formatTime(item.status_time)
      },
      {
        title: '',
        key: 'actions',
        width: '80px',
        className: 'actions',
        render: item => (
          <div className={styles.actions}>
            <Link to={linkUrl(item.user_id)}>{t('View detail')} →</Link>
          </div>
        )
      }
    ];

    return (
      <Layout>
        <TitleSearch
          title={t('All Providers')}
          placeholder={t('Search providers')}
          searchWord={searchWord}
          onSearch={onSearch}
          onClear={onClear}
        />

        <Table
          tableType="shield"
          store={vendorStore}
          data={vendors}
          isLoading={isLoading}
          columns={columns}
        />
      </Layout>
    );
  }
}

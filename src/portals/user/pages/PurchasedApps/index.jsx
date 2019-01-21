import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import Layout from 'portals/user/Layout';
import { Button, Table } from 'components/Base';
import Banner from 'components/Banner';
import Toolbar from 'components/Toolbar';
import TdName from 'components/TdName';
import Stars from 'components/Stars';
import { formatTime } from 'utils';
import { getVersionTypesName } from 'config/version-types';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  clusterStore: rootStore.clusterStore,
  appStore: rootStore.appStore,
  user: rootStore.user
}))
@observer
export default class Purchased extends Component {
  async componentDidMount() {
    const { clusterStore, appStore } = this.props;

    await clusterStore.fetchAll({ noLimit: true });
    const appIds = clusterStore.clusters.map(cluster => cluster.app_id);
    if (appIds.length > 0) {
      await appStore.fetchAll({ app_id: appIds });
    } else {
      appStore.apps = [];
    }
  }

  componentWillUnmount() {
    const { appStore } = this.props;
    appStore.reset();
  }

  renderToolbar() {
    const { appStore, t } = this.props;
    const {
      searchWord, onSearch, onClearSearch, onRefresh
    } = appStore;

    return (
      <Toolbar
        placeholder={t('搜索应用名称或 ID')}
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
      />
    );
  }

  render() {
    const { appStore, clusterStore, t } = this.props;
    const { apps, isLoading } = appStore;
    const { clusters } = clusterStore;

    const columns = [
      {
        title: t('App Name'),
        key: 'name',
        width: '150px',
        render: item => (
          <TdName
            name={item.name}
            description={item.abstraction || item.description}
            linkUrl={`/dashboard/purchased/${item.app_id}`}
            image={item.icon}
            noCopy
          />
        )
      },
      {
        title: t('交付方式'),
        key: 'version_type',
        width: '102px',
        render: item => (getVersionTypesName(item.app_version_types) || []).join(' ')
      },
      {
        title: t('实例总数'),
        key: 'total',
        width: '85px',
        render: item => clusters.filter(cluster => cluster.app_id === item.app_id).length
      },
      {
        title: t('我的评价'),
        key: 'star',
        width: '130px',
        render: () => <Stars starTotal={4} />
      },
      {
        title: t('上次部署时间'),
        key: 'create_time',
        width: '120px',
        render: item => formatTime(item.create_time, 'YYYY/MM/DD HH:mm:ss')
      },
      {
        title: t('Actions'),
        key: 'actions',
        width: '60px',
        className: 'actions',
        render: item => (
          <div>
            <Link to={`/dashboard/apps/${item.app_id}/deploy`}>
              <Button>{t('Deploy Instance')}</Button>
            </Link>
          </div>
        )
      }
    ];

    const pagination = {
      tableType: 'apps',
      onChange: appStore.changePagination,
      total: appStore.totalCount,
      current: appStore.currentPage,
      noCancel: false
    };

    return (
      <Layout
        banner={
          <Banner
            title={t('已部署应用')}
            description={t('所有你部署过的应用都会展示在此。')}
          />
        }
      >
        {this.renderToolbar()}
        <Table
          columns={columns}
          dataSource={apps.toJSON()}
          isLoading={isLoading}
          pagination={pagination}
        />
      </Layout>
    );
  }
}

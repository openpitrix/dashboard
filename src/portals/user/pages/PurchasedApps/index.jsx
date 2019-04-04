import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import Layout from 'portals/user/Layout';
import { Button, Table } from 'components/Base';
import Banner from 'components/Banner';
import Toolbar from 'components/Toolbar';
import TdName from 'components/TdName';
import Stars from 'components/Stars';
import VersionType from 'components/VersionType';
import { formatTime } from 'utils';

import routes, { toRoute } from 'routes';

import styles from './index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  clusterStore: rootStore.clusterStore,
  appStore: rootStore.appStore,
  user: rootStore.user
}))
@observer
export default class Purchased extends Component {
  async componentDidMount() {
    const { clusterStore, appStore, user } = this.props;

    await clusterStore.fetchAll({
      owner: user.user_id,
      noLimit: true
    });
    const appIds = clusterStore.clusters.map(cluster => cluster.app_id);
    if (appIds.length > 0) {
      await appStore.fetchActiveApps({ app_id: appIds, noLimit: true });
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
        placeholder={t('Search for app name or ID')}
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
        render: item => (
          <TdName
            name={item.name}
            description={item.abstraction || item.description || t('None')}
            linkUrl={toRoute(routes.portal.appDetail, { appId: item.app_id })}
            image={item.icon}
            noCopy
          />
        )
      },
      {
        title: t('Delivery type'),
        key: 'version_type',
        render: item => <VersionType types={item.app_version_types} />
      },
      {
        title: t('Total of instances'),
        key: 'total',
        className: 'boldFont',
        render: item => clusters.filter(cluster => cluster.app_id === item.app_id).length
      },
      {
        title: t('My Evaluation'),
        key: 'star',
        render: () => <Stars starTotal={5} />
      },
      {
        title: t('Last deploy time'),
        key: 'create_time',
        render: item => formatTime(item.create_time, 'YYYY/MM/DD HH:mm:ss')
      },
      {
        title: t('Actions'),
        key: 'actions',
        width: '145px',
        className: 'actions',
        render: item => (
          <div className={styles.deployButton}>
            <Link to={toRoute(routes.portal.deploy, { appId: item.app_id })}>
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
            title={t('Purchased')}
            description={t('DEPLOYED_APP_DESCRIPTION')}
          />
        }
      >
        {/* {this.renderToolbar()} */}
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

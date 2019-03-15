import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import _ from 'lodash';

import Layout from 'portals/user/Layout';
import { Icon, Table, Button } from 'components/Base';
import { Grid, Section, Card } from 'components/Layout';
import Banner from 'components/Banner';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import DetailTabs from 'components/DetailTabs';
import Stars from 'components/Stars';
import { formatTime, getObjName } from 'utils';
import { getVersionTypesName } from 'config/version-types';
import routes, { toRoute } from 'routes';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  clusterStore: rootStore.clusterStore,
  appStore: rootStore.appStore,
  appVersionStore: rootStore.appVersionStore,
  runtimeStore: rootStore.runtimeStore,
  user: rootStore.user
}))
@observer
export default class PurchasedDetail extends Component {
  async componentDidMount() {
    const {
      clusterStore, appStore, runtimeStore, match
    } = this.props;
    const { appId } = match.params;
    clusterStore.attachVersions = true;

    await appStore.fetch(appId);

    clusterStore.appId = appId;
    await clusterStore.fetchAll();

    await runtimeStore.fetchAll({
      status: ['active', 'deleted'],
      noLimit: true
    });
  }

  componentWillUnmount() {
    const { clusterStore } = this.props;
    clusterStore.reset();
  }

  goDeploy = () => {
    const { match, history } = this.props;
    history.push(toRoute(routes.portal.deploy, { appId: match.params.appId }));
  };

  renderVersionInfo(item) {
    const { versions } = this.props.appVersionStore;
    const version = _.find(versions, { version_id: item.version_id }) || {};

    return (
      <div className={styles.versionInfo}>
        {getVersionTypesName(version.type)}
        <label>{version.name}</label>
      </div>
    );
  }

  renderToolbar() {
    const { t } = this.props;
    const {
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh
    } = this.props.clusterStore;

    return (
      <Toolbar
        placeholder={t('Search Instances')}
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
      >
        <Button type="primary" className="pull-right" onClick={this.goDeploy}>
          <Icon name="add" type="white" />
          {t('Deploy')}
        </Button>
      </Toolbar>
    );
  }

  renderAppBase() {
    const { appStore, t } = this.props;
    const { appDetail } = appStore;

    return (
      <Card className={styles.appBase}>
        <TdName
          className={styles.title}
          name={appDetail.name}
          description={appDetail.description}
          image={appDetail.icon}
          noCopy
        />
        <div className={styles.info}>
          <dl>
            <dt>{t('应用编号')}</dt>
            <dd>{appDetail.app_id}</dd>
          </dl>
          <dl>
            <dt>{t('Categories')}</dt>
            <dd>
              {_.get(appDetail, 'category_set', [])
                .filter(cate => cate.category_id && cate.status === 'enabled')
                .map(cate => cate.name)
                .join(', ')}
            </dd>
          </dl>
          <dl>
            <dt>{t('Delivery type')}</dt>
            <dd>{appDetail.app_version_types}</dd>
          </dl>
          <dl>
            <dt>{t('应用服务商')}</dt>
            <dd>{appDetail.app_id}</dd>
          </dl>
          <dl>
            <dt>{t('上架时间')}</dt>
            <dd>{formatTime(appDetail.status_time, 'YYYY/MM/DD HH:mm:ss')}</dd>
          </dl>
          <dl>
            <dt>{t('我的评价')}</dt>
            <dd>
              <Stars starTotal={5} />
            </dd>
          </dl>
        </div>
        <Link
          to={toRoute(routes.appDetail, { appId: appDetail.app_id })}
          className={styles.link}
        >
          {t('去商店中查看')} →
        </Link>
      </Card>
    );
  }

  render() {
    const { clusterStore, runtimeStore, t } = this.props;
    const { clusters, isLoading } = clusterStore;
    const { runtimes } = runtimeStore;

    const columns = [
      {
        title: t('Status'),
        key: 'status',
        width: '100px',
        render: item => (
          <Status type={item.status} transition={item.transition_status} />
        )
      },
      {
        title: t('Instance ID'),
        key: 'name',
        width: '130px',
        render: item => (
          <TdName
            name={item.name}
            description={item.cluster_id}
            linkUrl={toRoute(routes.portal.clusterDetail, {
              clusterId: item.cluster_id,
              portal: 'user'
            })}
            noIcon
          />
        )
      },
      {
        title: t('Version'),
        key: 'app_id',
        width: '80px',
        render: item => this.renderVersionInfo(item)
      },
      {
        title: t('Deploy Runtime'),
        key: 'runtime_id',
        width: '120px',
        render: item => (
          <ProviderName
            name={getObjName(runtimes, 'runtime_id', item.runtime_id, 'name')}
            provider={getObjName(
              runtimes,
              'runtime_id',
              item.runtime_id,
              'provider'
            )}
          />
        )
      },
      {
        title: t('Node Count'),
        key: 'node_count',
        width: '60px',
        render: item => (item.cluster_node_set && item.cluster_node_set.length) || 0
      },
      {
        title: t('Created At'),
        key: 'create_time',
        width: '130px',
        render: item => formatTime(item.create_time, 'YYYY/MM/DD HH:mm:ss')
      },
      {
        title: '',
        key: 'actions',
        width: '60px',
        className: 'actions'
      }
    ];

    const pagination = {
      tableType: 'Clusters',
      onChange: clusterStore.changePagination,
      total: clusterStore.totalCount,
      current: clusterStore.currentPage,
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
        <Grid>
          <Section size={3}>{this.renderAppBase()}</Section>
          <Section size={9}>
            <DetailTabs tabs={['Instances']} />
            <Card>
              {this.renderToolbar()}
              <Table
                columns={columns}
                dataSource={clusters.toJSON()}
                isLoading={isLoading}
                pagination={pagination}
              />
            </Card>
          </Section>
        </Grid>
      </Layout>
    );
  }
}

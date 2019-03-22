import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import Layout from 'portals/user/Layout';
import { Icon, Button } from 'components/Base';
import { Grid, Section, Card } from 'components/Layout';
import Table from 'components/EnhanceTable';
import Banner from 'components/Banner';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import DetailTabs from 'components/DetailTabs';
import VersionType from 'components/VersionType';
import Stars from 'components/Stars';
import { formatTime, getObjName } from 'utils';
import { getVersionTypesName } from 'config/version-types';
import routes, { toRoute } from 'routes';

import styles from './index.scss';

@withTranslation()
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
      rootStore,
      clusterStore,
      appStore,
      runtimeStore,
      match
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

    rootStore.sock.listenToJob(this.handleJobs);
  }

  componentWillUnmount() {
    const { rootStore, clusterStore } = this.props;
    clusterStore.reset();
    rootStore.sock.unlisten(this.handleJobs);
  }

  handleJobs = async ({ type = '', resource = {} }) => {
    const { rtype = '', rid = '', values = {} } = resource;
    const op = `${type}:${rtype}`;
    const { clusterStore } = this.props;
    const { clusters, jobs } = clusterStore;
    const status = _.pick(values, ['status', 'transition_status']);
    const clusterIds = clusters.map(cl => cl.cluster_id);

    if (op === 'create:job' && clusterIds.includes(values.cluster_id)) {
      // new job
      jobs[rid] = values.cluster_id;
    }

    // job updated
    if (op === 'update:job') {
      if (['successful', 'failed'].includes(status.status)) {
        delete jobs[rid];
        await clusterStore.fetchAll();
      }
    }

    if (rtype === 'cluster' && clusterIds.includes(rid)) {
      clusterStore.clusters = clusters.map(cl => {
        if (cl.cluster_id === rid) {
          Object.assign(cl, status);
        }
        return cl;
      });
    }
  };

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
        <Button
          type="primary"
          className={styles.addButton}
          onClick={this.goDeploy}
        >
          <Icon name="add" type="white" className={styles.icon} />
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
          description={
            appDetail.abstraction || appDetail.description || t('None')
          }
          image={appDetail.icon}
          noCopy
        />
        <div className={styles.info}>
          <dl>
            <dt>{t('App No')}</dt>
            <dd>{appDetail.app_id}</dd>
          </dl>
          <dl>
            <dt>{t('Categories')}</dt>
            <dd>
              {_.get(appDetail, 'category_set', [])
                .filter(cate => cate.category_id && cate.status === 'enabled')
                .map(cate => t(cate.name))
                .join(', ')}
            </dd>
          </dl>
          <dl>
            <dt>{t('Delivery type')}</dt>
            <dd>
              <VersionType types={appDetail.app_version_types} />
            </dd>
          </dl>
          <dl>
            <dt>{t('App service provider')}</dt>
            <dd>{appDetail.company_name}</dd>
          </dl>
          <dl>
            <dt>{t('Publish time')}</dt>
            <dd>{formatTime(appDetail.status_time, 'YYYY/MM/DD HH:mm:ss')}</dd>
          </dl>
          <dl>
            <dt>{t('My Evaluation')}</dt>
            <dd>
              <Stars starTotal={5} />
            </dd>
          </dl>
        </div>
        <Link
          to={toRoute(routes.appDetail, { appId: appDetail.app_id })}
          className={styles.link}
        >
          {t('View in Store')} →
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

    return (
      <Layout
        banner={
          <Banner
            title={t('Purchased')}
            description={t('DEPLOYED_APP_DESCRIPTION')}
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
                tableType="Cluster"
                columns={columns}
                store={clusterStore}
                data={clusters}
                isLoading={isLoading}
              />
            </Card>
          </Section>
        </Grid>
      </Layout>
    );
  }
}

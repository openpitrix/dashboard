import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import {
  Input, Table, Image, Icon, Popover
} from 'components/Base';
import Layout, {
  Grid, Section, Card, Dialog
} from 'components/Layout';
import DetailTabs from 'components/DetailTabs';
import Status from 'components/Status';
import TdName from 'components/TdName';
import TimeShow from 'components/TimeShow';
import AppStatistics from 'components/AppStatistics';
import { versionTypes, getVersionTypesName } from 'config/version-types';
import { formatTime } from 'utils';
import Versions from '../../Versions';

import styles from './index.scss';

const tags = [
  { name: 'User instances', value: 'instance' },
  { name: 'Online version', value: 'online' },
  { name: 'Audit record', value: 'record' }
];
@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  appVersionStore: rootStore.appVersionStore,
  clusterStore: rootStore.clusterStore,
  userStore: rootStore.userStore,
  user: rootStore.user
}))
@observer
export default class AppDetail extends Component {
  async componentDidMount() {
    const {
      appStore,
      appVersionStore,
      clusterStore,
      userStore,
      match
    } = this.props;
    const { appId } = match.params;

    await appStore.fetch(appId);

    await appVersionStore.fetchActiveVersions({ app_id: appId, noLimit: true });

    clusterStore.appId = appId;
    // get month deploy total
    await clusterStore.fetchAll({ app_id: appId, created_date: 30, limit: 1 });
    // get deploy total and user instance
    await clusterStore.fetchAll({ app_id: appId });

    // to fix: should query provider info
    const { appDetail } = appStore;
    await userStore.fetchDetail({ user_id: appDetail.owner });
  }

  changeTab = async tab => {
    const {
      appStore, appVersionStore, userStore, match
    } = this.props;

    if (tab !== appStore.detailTab) {
      appStore.detailTab = tab;

      if (tab === 'online') {
        const { appId } = match.params;
        await appVersionStore.fetchTypeVersions(appId, true);
      } else if (tab === 'record') {
        const { appDetail } = appStore;
        const versionId = _.get(appDetail, 'latest_app_version.version_id', '');
        await appVersionStore.fetchAudits(appDetail.app_id, versionId);
        // query record relative operators name
        const userIds = _.get(appVersionStore.audits, versionId, []).map(
          item => item.operator
        );
        await userStore.fetchAll({ user_id: _.uniq(userIds) });
      }
    }
  };

  renderHandleMenu = () => {
    const { appStore, match, t } = this.props;
    const { appId } = match.params;

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/apps/${appId}/deploy`}>
          <Icon name="stateful-set" type="dark" /> {t('部署实例')}
        </Link>
        <span onClick={() => appStore.showModal('suspend')}>
          <Icon name="sort-descending" type="dark" /> {t('下架应用')}
        </span>
      </div>
    );
  };

  renderSuspendDialog = () => {
    const { appStore, t } = this.props;
    const { isModalOpen, hideModal } = appStore;

    return (
      <Dialog
        title={t('Note')}
        isOpen={isModalOpen}
        onSubmit={hideModal}
        onCancel={hideModal}
      >
        {t('应用下架后用户无法从商店中购买到此应用，你确定要下架吗？')}
      </Dialog>
    );
  };

  renderVersionName = version_id => {
    const { appVersionStore } = this.props;
    const { versions } = appVersionStore;
    const version = _.find(versions, { version_id }) || {};
    const typeName = getVersionTypesName(version.type);

    return (
      <div className={styles.versionName}>
        <label className={styles.type}>{typeName}</label>
        {version.name}
      </div>
    );
  };

  renderRecord() {
    const {
      appVersionStore, appStore, userStore, t
    } = this.props;
    const { appDetail } = appStore;
    const { users } = userStore;
    const { audits } = appVersionStore;
    const versionId = _.get(appDetail, 'latest_app_version.version_id', '');
    const records = audits[versionId] || [];

    const columns = [
      {
        title: t('Apply No'),
        key: 'number',
        width: '120px',
        render: item => item.version_id
      },
      {
        title: t('Apply Type'),
        key: 'type',
        width: '60px',
        render: item => item.type || t('App on the shelf')
      },
      {
        title: t('Status'),
        key: 'status',
        width: '80px',
        render: cl => (
          <Status type={cl.status} transition={cl.transition_status} />
        )
      },
      {
        title: t('Update time'),
        key: 'status_time',
        width: '100px',
        render: item => formatTime(item.status_time, 'YYYY/MM/DD HH:mm:ss')
      },
      {
        title: t('Auditors'),
        key: 'operator',
        width: '80px',
        render: item => (_.find(users, { user_id: item.operator }) || {}).username
      }
    ];

    // todo
    const pagination = {
      tableType: 'Clusters',
      total: records.length,
      current: 1
    };

    return (
      <Card>
        <Table columns={columns} dataSource={records} pagination={pagination} />
      </Card>
    );
  }

  renderInstance() {
    const { clusterStore, t } = this.props;
    const {
      clusters, onSearch, onClearSearch, searchWord
    } = clusterStore;

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
        title: t('Instance Name ID'),
        key: 'name',
        width: '155px',
        render: item => (
          <TdName name={item.name} description={item.cluster_id} noIcon />
        )
      },
      {
        title: t('Version'),
        key: 'app_id',
        width: '100px',
        render: item => this.renderVersionName(item.version_id)
      },
      {
        title: t('Node Count'),
        key: 'node_count',
        width: '80px',
        render: item => (item.cluster_node_set && item.cluster_node_set.length) || 0
      },
      {
        title: t('Created At'),
        key: 'create_time',
        width: '120px',
        render: item => <TimeShow time={item.create_time} />
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
      <Card>
        <div className={styles.searchOuter}>
          <p className={styles.total}>
            {t('DEPLOYED_APP_TOTAL', { total: clusterStore.totalCount })}
          </p>
          <Input.Search
            className={styles.search}
            placeholder={t('Search or filter')}
            value={searchWord}
            onSearch={onSearch}
            onClear={onClearSearch}
          />
        </div>
        <Table
          columns={columns}
          dataSource={clusters.toJSON()}
          pagination={pagination}
        />
      </Card>
    );
  }

  renderAppBase() {
    const { appStore, userStore, t } = this.props;
    const { appDetail } = appStore;
    const { userDetail } = userStore;
    const categories = _.get(appDetail, 'category_set', []);

    return (
      <Card className={styles.appBase}>
        <div className={styles.title}>
          <span className={styles.image}>
            <Image
              src={appDetail.icon}
              iconLetter={appDetail.name}
              iconSize={48}
            />
          </span>
          <span className={styles.appName}>{appDetail.name}</span>
        </div>
        <div className={styles.info}>
          <dl>
            <dt>{t('App No')}</dt>
            <dd>{appDetail.app_id}</dd>
          </dl>
          <dl>
            <dt>{t('Delivery type')}</dt>
            <dd>{appDetail.app_version_types}</dd>
          </dl>
          <dl>
            <dt>{t('App intro')}</dt>
            <dd>{appDetail.abstraction}</dd>
          </dl>
          <dl>
            <dt>{t('Category')}</dt>
            <dd>
              {categories.map(item => (
                <label key={item.category_id}>{item.name}</label>
              ))}
            </dd>
          </dl>
          <dl>
            <dt>{t('Developer')}</dt>
            <dd>{userDetail.username}</dd>
          </dl>
          <dl>
            <dt>{t('Publish time')}</dt>
            <dd>{formatTime(appDetail.status_time, 'YYYY/MM/DD HH:mm:ss')}</dd>
          </dl>
          <Link to="/" className={styles.link}>
            {t('View in store')} →
          </Link>
          <Popover
            className={classnames('operation', styles.operationIcon)}
            content={this.renderHandleMenu()}
          >
            <Icon name="more" />
          </Popover>
        </div>
      </Card>
    );
  }

  render() {
    const {
      appVersionStore, appStore, clusterStore, t
    } = this.props;
    const { detailTab } = appStore;
    const { versions } = appVersionStore;

    return (
      <Layout pageTitle={t('App Detail')} hasBack>
        <Grid>
          <Section size={4}>{this.renderAppBase()}</Section>
          <Section size={8}>
            <AppStatistics
              isAppDetail
              versionTotal={versions.length}
              totalDepoly={clusterStore.totalCount}
              monthDepoly={clusterStore.monthCount}
            />
            <DetailTabs tabs={tags} changeTab={this.changeTab} />
            {detailTab === 'instance' && this.renderInstance()}
            {detailTab === 'online' && <Versions isAppDetail />}
            {detailTab === 'record' && this.renderRecord()}
          </Section>
        </Grid>
        {this.renderSuspendDialog()}
      </Layout>
    );
  }
}

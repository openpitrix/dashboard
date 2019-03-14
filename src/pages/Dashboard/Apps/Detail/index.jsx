import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import {
  Input, Table, Image, Icon, PopoverIcon
} from 'components/Base';
import Layout, {
  Grid, Section, Card, Dialog
} from 'components/Layout';
import DetailTabs from 'components/DetailTabs';
import Status from 'components/Status';
import TdName from 'components/TdName';
import TimeShow from 'components/TimeShow';
import VersionType from 'components/VersionType';
import AppStatistics from 'components/AppStatistics';
import { formatTime, mappingStatus } from 'utils';
import routes, { toRoute } from 'routes';

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

    await appVersionStore.fetchAll({
      app_id: appId,
      status: ['active', 'suspended'],
      noLimit: true
    });

    clusterStore.appId = appId;
    // get month deploy total
    await clusterStore.fetchAll({
      app_id: appId,
      created_date: 30,
      limit: 1,
      isUserAction: true
    });
    // get deploy total and user instance
    await clusterStore.fetchAll({
      app_id: appId,
      limit: 1,
      isUserAction: true
    });

    // to fix: should query provider info
    const { appDetail } = appStore;
    await userStore.fetchDetail({ user_id: appDetail.owner });
  }

  componentWillUnmount() {
    const { appStore, clusterStore } = this.props;
    appStore.reset();
    clusterStore.reset();
  }

  changeTab = async tab => {
    const { appStore, appVersionStore, userStore } = this.props;

    if (tab !== appStore.detailTab) {
      appStore.detailTab = tab;

      if (tab === 'record') {
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

  handle = async () => {
    const { appStore, appVersionStore } = this.props;
    const { modalType } = appStore;
    const { versions, versionId, versionSuspend } = appVersionStore;
    const operateType = modalType.split('-');
    const versionIds = operateType[1] === 'version'
      ? [versionId]
      : versions.map(item => item.version_id);
    await versionSuspend(versionIds, operateType[0]);
  };

  renderAppHandleMenu = appDetail => {
    const { appStore, match, t } = this.props;
    const { appId } = match.params;

    return (
      <div className="operate-menu">
        <Link to={toRoute(routes.portal.deploy, { appId })}>
          <Icon name="stateful-set" type="dark" /> {t('Deploy Instance')}
        </Link>
        {appDetail.status === 'active' && (
          <span onClick={() => appStore.showModal('suspend-app')}>
            <Icon name="sort-descending" type="dark" /> {t('Suspend app')}
          </span>
        )}
        {appDetail.status === 'suspended' && (
          <span onClick={() => appStore.showModal('recover-app')}>
            <Icon name="sort-ascending" type="dark" /> {t('Recover app')}
          </span>
        )}
      </div>
    );
  };

  renderVersionHandleMenu = item => {
    const {
      appStore, appVersionStore, match, t
    } = this.props;
    const { appId } = match.params;
    appVersionStore.versionId = item.version_id;

    return (
      <div className="operate-menu">
        <Link
          to={toRoute(routes.portal.deploy, {
            appId,
            versionId: item.version_id
          })}
        >
          <Icon name="stateful-set" type="dark" /> {t('Deploy Instance')}
        </Link>
        {item.status === 'active' && (
          <span onClick={() => appStore.showModal('suspend-version')}>
            <Icon name="sort-descending" type="dark" /> {t('Suspend version')}
          </span>
        )}
        {item.status === 'suspended' && (
          <span onClick={() => appStore.showModal('recover-version')}>
            <Icon name="sort-ascending" type="dark" /> {t('Recover version')}
          </span>
        )}
      </div>
    );
  };

  renderSuspendDialog = () => {
    const { appStore, t } = this.props;
    const { isModalOpen, modalType, hideModal } = appStore;

    return (
      <Dialog
        title={t('Note')}
        isOpen={isModalOpen}
        onSubmit={this.handle}
        onCancel={hideModal}
      >
        {t(`${modalType}-note-desc`)}
      </Dialog>
    );
  };

  renderVersionName = version_id => {
    const { appVersionStore } = this.props;
    const { versions } = appVersionStore;
    const version = _.find(versions, { version_id }) || {};

    return (
      <div className={styles.versionName}>
        <VersionType types={version.type} />
        <span className={styles.name}>{version.name}</span>
      </div>
    );
  };

  renderRecord() {
    const {
      appVersionStore, appStore, userStore, t
    } = this.props;
    const { appDetail } = appStore;
    const { users } = userStore;
    const { audits, isLoading } = appVersionStore;
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
      <Table
        isLoading={isLoading}
        columns={columns}
        dataSource={records}
        pagination={pagination}
      />
    );
  }

  renderVersions() {
    const { appVersionStore, user, t } = this.props;
    const { versions } = appVersionStore;

    let columns = [
      {
        title: t('Version No'),
        key: 'name',
        width: '100px',
        render: item => item.name
      },
      {
        title: t('Delivery type'),
        key: 'app_id',
        width: '100px',
        render: item => (
          <VersionType className={styles.versionType} types={item.type} />
        )
      },
      {
        title: t('Status'),
        key: 'status',
        width: '100px',
        render: item => (
          <Status type={item.status} name={mappingStatus(item.status)} />
        )
      },
      {
        title: t('Created At'),
        key: 'create_time',
        width: '120px',
        render: item => <TimeShow time={item.create_time} />
      },
      {
        title: '',
        key: 'actions',
        width: '70px',
        className: 'actions',
        render: item => (
          <PopoverIcon
            size="Large"
            portal
            className={styles.operationVersion}
            content={this.renderVersionHandleMenu(item)}
          />
        )
      }
    ];
    if (!user.isAdmin) {
      columns = columns.filter(item => item.key !== 'actions');
    }

    const pagination = {
      tableType: 'application',
      onChange: appVersionStore.changePagination,
      total: appVersionStore.totalCount,
      current: appVersionStore.currentPage,
      noCancel: false
    };

    return (
      <Table
        columns={columns}
        dataSource={versions.toJSON()}
        pagination={pagination}
      />
    );
  }

  renderInstance() {
    const { clusterStore, userStore, t } = this.props;
    const {
      clusters, onSearch, onClearSearch, searchWord
    } = clusterStore;
    const { users } = userStore;

    const columns = [
      {
        title: t('Status'),
        key: 'status',
        width: '80px',
        render: item => (
          <Status type={item.status} transition={item.transition_status} />
        )
      },
      {
        title: t('Instance Name ID'),
        key: 'name',
        width: '130px',
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
        title: t('User'),
        key: 'owner',
        width: '100px',
        render: item => (_.find(users, { user_id: item.owner }) || {}).email
      },
      {
        title: t('Node Count'),
        key: 'node_count',
        width: '70px',
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
      <Fragment>
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
      </Fragment>
    );
  }

  renderAppBase() {
    const { appStore, user, t } = this.props;
    const { appDetail } = appStore;
    const categories = _.get(appDetail, 'category_set', []);
    const isSuspend = appDetail.status === 'suspended';

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
            <dt>{t('App intro')}</dt>
            <dd>{appDetail.abstraction || t('None')}</dd>
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
            <dt>{t('Delivery type')}</dt>
            <dd>
              <VersionType types={appDetail.app_version_types} />
            </dd>
          </dl>
          <dl>
            <dt>{t('App service provider')}</dt>
            <dd>{appDetail.provider || t('None')}</dd>
          </dl>
          <dl>
            <dt>{t(isSuspend ? 'Suspend time' : 'Publish time')}</dt>
            <dd>{formatTime(appDetail.status_time, 'YYYY/MM/DD HH:mm:ss')}</dd>
          </dl>
          {isSuspend ? (
            <label className={styles.suspended}>{t('Recalled')}</label>
          ) : (
            <Link to="/" className={styles.link}>
              {t('View in store')} →
            </Link>
          )}
          {user.isAdmin && (
            <PopoverIcon
              portal
              size="Large"
              className={classnames('operation', styles.operationIcon)}
              content={this.renderAppHandleMenu(appDetail)}
            />
          )}
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
            <Card>
              <DetailTabs tabs={tags} changeTab={this.changeTab} isCardTab />
              {detailTab === 'instance' && this.renderInstance()}
              {detailTab === 'online' && this.renderVersions()}
              {detailTab === 'record' && this.renderRecord()}
            </Card>
          </Section>
        </Grid>
        {this.renderSuspendDialog()}
      </Layout>
    );
  }
}

import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { filter, get, orderBy, capitalize } from 'lodash';
import classnames from 'classnames';

import { Icon, Button, Table, Popover, Select, Modal, Image } from 'components/Base';
import Layout, { Dialog, Grid, Row, Section, Card, NavLink } from 'components/Layout';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import Statistics from 'components/Statistics';
import TimeShow from 'components/TimeShow';
import { getObjName, mappingStatus, getFilterObjs } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore,
  repoStore: rootStore.repoStore,
  userStore: rootStore.userStore,
  user: rootStore.user
}))
@observer
export default class Review extends Component {
  static async onEnter({ appVersionStore, appStore, categoryStore, repoStore, userStore }) {
    appVersionStore.registerStore('app', appStore);
    appVersionStore.registerStore('user', userStore);
    appVersionStore.isReview = true;

    await appVersionStore.fetchAll();
    await repoStore.fetchAll({
      status: ['active', 'deleted'],
      noLimit: true
    });
    //await categoryStore.fetchAll();
  }

  constructor(props) {
    super(props);
    const { appVersionStore, appStore, repoStore, userStore } = this.props;
    appVersionStore.loadPageInit();
    repoStore.loadPageInit();
    appVersionStore.isReview = true;
    appVersionStore.registerStore('app', appStore);
    appVersionStore.registerStore('user', userStore);
  }

  renderToolbar() {
    const { t } = this.props;
    const { searchWord, onSearch, onClearSearch, onRefresh } = this.props.appVersionStore;

    return (
      <Toolbar
        placeholder={t('Search App')}
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
      />
    );
  }

  render() {
    const { appVersionStore, appStore, repoStore, userStore, t } = this.props;
    const { versions, isLoading } = appVersionStore;
    const { apps } = appStore;
    const { repos } = repoStore;
    const { users } = userStore;

    const columns = [
      {
        title: t('Status'),
        key: 'status',
        width: '110px',
        render: item => <Status type={item.status} name={mappingStatus(item.status)} />
      },
      {
        title: t('App Name'),
        key: 'name',
        width: '175px',
        render: item => (
          <TdName
            name={getObjName(apps, 'app_id', item.app_id, 'name')}
            description={item.app_id}
            image={item.icon || 'appcenter'}
            linkUrl={`/dashboard/review/${item.app_id}?versionId=${item.version_id}`}
          />
        )
      },
      {
        title: t('Version'),
        key: 'latest_version',
        width: '120px',
        render: item => item.name
      },
      /* {
        title: t('Categories'),
        key: 'category',
        width: '120px',
        render: item =>
          t(
            get(item, 'category_set', [])
              .filter(cate => cate.category_id && cate.status === 'enabled')
              .map(cate => cate.name)
              .join(', ')
          )
      },*/
      {
        title: t('Repo'),
        key: 'repo_id',
        width: '125px',
        render: item => (
          <ProviderName
            className={styles.provider}
            name={getObjName(
              repos,
              'repo_id',
              getFilterObjs(apps, 'app_id', item.app_id).repo_id,
              'name'
            )}
            provider={getObjName(
              repos,
              'repo_id',
              getFilterObjs(apps, 'app_id', item.app_id).repo_id,
              'providers[0]'
            )}
          />
        )
      },
      {
        title: t('Developer'),
        key: 'developer',
        width: '80px',
        render: item => getObjName(users, 'user_id', item.owner, 'username') || item.owner
      },
      {
        title: t('Updated At'),
        key: 'status_time',
        width: '92px',
        sorter: this.role === 'global_admin',
        onChangeSort: this.onChangeSort,
        render: item => <TimeShow time={item.status_time} />
      }
    ];

    const filterList = [
      {
        key: 'status',
        conditions: [
          { name: t('Submitted'), value: 'submitted' },
          { name: t('Passed'), value: 'passed' },
          { name: t('Rejected'), value: 'rejected' }
        ],
        onChangeFilter: appVersionStore.onChangeStatus,
        selectValue: appVersionStore.selectStatus
      }
    ];

    const pagination = {
      tableType: 'Apps',
      onChange: appVersionStore.changePagination,
      total: appVersionStore.totalCount,
      current: appVersionStore.currentPage,
      noCancel: false
    };

    return (
      <Layout className={styles.apps}>
        <NavLink>
          {t('Store')} / {t('App Reviews')}
        </NavLink>

        <Row>
          <Grid>
            <Section size={12}>
              <Card>
                {this.renderToolbar()}

                <Table
                  columns={columns}
                  dataSource={versions.toJSON()}
                  filterList={filterList}
                  pagination={pagination}
                  isLoading={isLoading}
                />
              </Card>
            </Section>
          </Grid>
        </Row>
      </Layout>
    );
  }
}

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
import { getSessInfo, getObjName, changeStatus } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore, sessInfo }) => ({
  rootStore,
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore,
  repoStore: rootStore.repoStore,
  sessInfo
}))
@observer
export default class Review extends Component {
  static async onEnter({ appStore, categoryStore, repoStore, sessInfo }) {
    await appStore.fetchAll({
      status: ['draft']
    });
    await repoStore.fetchAll({
      status: ['active', 'deleted'],
      noLimit: true
    });
    await categoryStore.fetchAll();
  }

  constructor(props) {
    super(props);
    const { appStore, repoStore, sessInfo } = this.props;
    appStore.loadPageInit();
    repoStore.loadPageInit();
  }

  renderToolbar() {
    const { t } = this.props;
    const { searchWord, onSearch, onClearSearch, onRefresh } = this.props.appStore;

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
    const { appStore, repoStore, t } = this.props;
    const { apps, isLoading } = appStore;

    const { repos } = repoStore;

    let columns = [
      {
        title: t('App Name'),
        key: 'name',
        width: '175px',
        render: item => (
          <TdName
            name={item.name}
            description={item.app_id}
            image={item.icon || 'appcenter'}
            linkUrl={`/dashboard/review/${item.app_id}`}
          />
        )
      },
      {
        title: t('Latest Version'),
        key: 'latest_version',
        width: '120px',
        render: item => get(item, 'latest_app_version.name', '')
      },
      {
        title: t('Status'),
        key: 'status',
        width: '90px',
        render: item => <Status type={item.status} name={changeStatus(item.status)} />
      },
      {
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
      },
      {
        title: t('Visibility'),
        key: 'visibility',
        width: '65px',
        render: item => t(getObjName(repos, 'repo_id', item.repo_id, 'visibility'))
      },
      {
        title: t('Repo'),
        key: 'repo_id',
        width: '125px',
        render: item => (
          <Link to={`/dashboard/repo/${item.repo_id}`}>
            <ProviderName
              className={styles.provider}
              name={getObjName(repos, 'repo_id', item.repo_id, 'name')}
              provider={getObjName(repos, 'repo_id', item.repo_id, 'providers[0]')}
            />
          </Link>
        )
      },
      {
        title: t('Developer'),
        key: 'developer',
        width: '80px',
        render: item => item.owner
      },
      {
        title: t('Updated At'),
        key: 'status_time',
        width: '112px',
        sorter: this.role === 'global_admin',
        onChangeSort: this.onChangeSort,
        render: item => <TimeShow time={item.status_time} />
      }
    ];

    const pagination = {
      tableType: 'Apps',
      onChange: appStore.changePagination,
      total: appStore.totalCount,
      current: appStore.currentPage,
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
                  dataSource={apps.slice(0, 10)}
                  pagination={pagination}
                  isLoading={isLoading}
                />
              </Card>
              }
            </Section>
          </Grid>
        </Row>
      </Layout>
    );
  }
}

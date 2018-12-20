import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import { Table } from 'components/Base';
import Layout from 'components/Layout';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import AppName from 'components/AppName';
import TimeShow from 'components/TimeShow';

import { getObjName, mappingStatus } from 'utils';

import styles from './index.scss';

const types = [
  { name: 'Processed', value: 'processed' },
  { name: 'Unprocessed', value: 'unprocessed' }
];

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore,
  userStore: rootStore.userStore,
  user: rootStore.user
}))
@observer
export default class Reviews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeType: 'processed'
    };
  }

  async componentDidMount() {
    const { appVersionStore, appStore, userStore } = this.props;

    appVersionStore.registerStore('app', appStore);
    appVersionStore.registerStore('user', userStore);

    appVersionStore.isReview = true;

    await appVersionStore.fetchAll();
  }

  componentWillUnmount() {
    const { appVersionStore } = this.props;
    appVersionStore.reset();
  }

  changeType = type => {
    const { activeType } = this.state;

    if (type !== activeType) {
      this.setState({ activeType: type });
    }
  };

  renderToolbar() {
    const { t } = this.props;
    const {
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh
    } = this.props.appVersionStore;

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
    const {
      appVersionStore, appStore, userStore, t
    } = this.props;
    const { versions, isLoading } = appVersionStore;
    const { apps } = appStore;
    const { users } = userStore;

    const columns = [
      {
        title: t('编号'),
        key: 'no',
        width: '135px',
        render: item => (
          <Link to={`/dashboard/app-review/${item.app_id}/${item.version_id}`}>
            {item.version_id}
          </Link>
        )
      },
      {
        title: t('审核类型'),
        key: 'audit_type',
        width: '70px',
        render: item => item.type
      },
      {
        title: t('App Info'),
        key: 'appName',
        width: '155px',
        render: item => (
          <AppName
            image={item.icon}
            name={getObjName(apps, 'app_id', item.app_id, 'name')}
            type={item.type}
            versionName={item.name}
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
        title: t('提交时间'),
        key: 'status_time',
        width: '130px',
        sorter: this.role === 'global_admin',
        onChangeSort: this.onChangeSort,
        render: item => <TimeShow time={item.status_time} type="detailTime" />
      },
      {
        title: t('Status'),
        key: 'status',
        width: '110px',
        render: item => (
          <Status type={item.status} name={mappingStatus(item.status)} />
        )
      }
    ];

    const filterList = [
      {
        key: 'status',
        conditions: [
          { name: t('Submitted'), value: 'submitted' },
          { name: t('Passed'), value: 'passed' },
          { name: t('Rejected'), value: 'rejected' },
          { name: t(mappingStatus('Active')), value: 'active' },
          { name: t(mappingStatus('Suspended')), value: 'suspended' }
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

    const { activeType } = this.state;

    return (
      <Layout pageTitle={t('App Reviews')}>
        <div className={styles.types}>
          {types.map(type => (
            <label
              key={type.value}
              onClick={() => this.changeType(type.value)}
              className={classnames({
                [styles.active]: activeType === type.value
              })}
            >
              {t(type.name)}
            </label>
          ))}
        </div>
        <Table
          columns={columns}
          dataSource={versions.toJSON()}
          filterList={filterList}
          pagination={pagination}
          isLoading={isLoading}
        />
      </Layout>
    );
  }
}

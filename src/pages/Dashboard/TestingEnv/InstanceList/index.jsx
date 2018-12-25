import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { inject, observer } from 'mobx-react';

import { Icon, Table, Button } from 'components/Base';
import Toolbar from 'components/Toolbar';
import columns from './columns';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  user: rootStore.user,
  envStore: rootStore.testingEnvStore,
  clusterStore: rootStore.clusterStore,
  appStore: rootStore.appStore
}))
@observer
export default class RuntimeInstances extends React.Component {
  static propTypes = {
    runtime: PropTypes.shape({
      name: PropTypes.string,
      runtime_id: PropTypes.string
    })
  };

  async componentDidMount() {
    const { clusterStore, runtime, user } = this.props;
    await clusterStore.fetchAll({
      attachApps: true,
      runtime_id: runtime.runtime_id,
      owner: user.user_id
    });
  }

  goBack = () => {
    this.props.envStore.changeRuntimeToShowInstances();
  };

  handleClickToolbar = () => {
    // todo
  };

  renderToolbar() {
    const { t } = this.props;
    const {
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      clusterIds
    } = this.props.clusterStore;

    if (clusterIds.length) {
      return (
        <Toolbar noRefreshBtn noSearchBox>
          <Button type="default" onClick={this.handleClickToolbar}>
            <Icon name="start" size={20} type="dark" />
            {t('Start')}
          </Button>
          <Button type="default" onClick={this.handleClickToolbar}>
            <Icon name="stop" size={20} type="dark" />
            {t('Stop')}
          </Button>
          <Button type="delete" onClick={this.handleClickToolbar}>
            {t('Delete')}
          </Button>
        </Toolbar>
      );
    }

    return (
      <Toolbar
        placeholder={t('Search Clusters')}
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
        noRefreshBtn
      />
    );
  }

  renderTable() {
    const {
      clusterStore, appStore, user, t
    } = this.props;
    const { clusters, isLoading } = clusterStore;
    const { apps } = appStore;

    const rowSelection = {
      type: 'checkbox',
      selectType: 'onSelect',
      selectedRowKeys: clusterStore.selectedRowKeys,
      onChange: clusterStore.onChangeSelect
    };

    const filterList = [
      {
        key: 'status',
        conditions: [
          { name: t('Pending'), value: 'pending' },
          { name: t('Active'), value: 'active' },
          { name: t('Stopped'), value: 'stopped' },
          { name: t('Suspended'), value: 'suspended' },
          { name: t('Deleted'), value: 'deleted' },
          { name: t('Ceased'), value: 'ceased' }
        ],
        onChangeFilter: clusterStore.onChangeStatus,
        selectValue: clusterStore.selectStatus
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
      // todo
      <Table
        columns={columns(t, apps, user.isDev)}
        dataSource={clusters.toJSON()}
        rowSelection={rowSelection}
        isLoading={isLoading}
        filterList={filterList}
        pagination={pagination}
      />
    );
  }

  render() {
    const { runtime, t } = this.props;

    return (
      <div>
        <div className={styles.toolbar}>
          <Icon onClick={this.goBack} name="back" size={24} type="dark" />
          <span className={styles.backTxt}>{t('Back')}</span>
        </div>
        <div className={styles.title}>
          <span className={styles.tip}>{t('Selected runtime')}: </span>
          <span className={styles.txt}>{runtime.name}</span>
        </div>

        <div>
          {this.renderToolbar()}
          {this.renderTable()}
        </div>
      </div>
    );
  }
}

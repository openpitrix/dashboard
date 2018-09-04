import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/index';
import { translate } from 'react-i18next';
import { get, pick } from 'lodash';

import { Icon, Table, Popover } from 'components/Base';
import Layout, { BackBtn, Grid, Section, Panel, Card, Dialog } from 'components/Layout';
import UserCard from 'components/DetailCard/UserCard';
import TagNav from 'components/TagNav';
import Toolbar from 'components/Toolbar';
import appColumns from 'utils/columns/app-columns';
import clusterColumns from 'utils/columns/cluster-columns';
import runtimesColumns from 'utils/columns/runtime-columns';
import repoColumns from 'utils/columns/repo-columns';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  userStore: rootStore.userStore,
  appStore: rootStore.appStore,
  clusterStore: rootStore.clusterStore,
  runtimeStore: rootStore.runtimeStore,
  repoStore: rootStore.repoStore
}))
@translate()
@observer
export default class Detail extends Component {
  static async onEnter({ userStore }, { userId }) {
    //await userStore.fetchUsersDetail(userId);
  }

  constructor(props) {
    super(props);
    const { appStore, clusterStore, runtimeStore, repoStore } = this.props;

    appStore.loadPageInit();
    clusterStore.loadPageInit();
    runtimeStore.loadPageInit();
    repoStore.loadPageInit();
  }

  renderHandleMenu = id => {
    const { t } = this.props;

    return (
      <div className="operate-menu">
        <span onClick={() => this.deleteUser(id)}>{t('Delete user')}</span>
      </div>
    );
  };

  changeDetailTab = async tab => {
    const { userStore, appStore, clusterStore, runtimeStore, repoStore, match } = this.props;
    const { userId } = match.params;
    userStore.currentTag = tab;

    switch (tab) {
      case 'Apps':
        appStore.userId = userId;
        await appStore.fetchAll();
        break;
      case 'Clusters':
        clusterStore.userId = userId;
        await clusterStore.fetchAll();
        break;
      case 'Runtimes':
        runtimeStore.userId = userId;
        await runtimeStore.fetchAll();
        const { runtimes } = runtimeStore;
        if (runtimes.length > 0) {
          const runtimeIds = runtimes.map(item => item.runtime_id);
          await clusterStore.fetchAll({
            runtime_id: runtimeIds,
            limit: 200
          });
        }
        break;
      case 'Repos':
        repoStore.userId = userId;
        console.log('Repos', userId);
        await repoStore.fetchAll();
        break;
    }
  };

  renderToolbar(options = {}) {
    return (
      <Toolbar
        {...pick(options, ['searchWord', 'onSearch', 'onClear', 'onRefresh', 'placeholder'])}
      />
    );
  }

  renderTable(options = {}) {
    return (
      <Table
        {...pick(options, ['columns', 'dataSource', 'isLoading', 'filterList', 'pagination'])}
      />
    );
  }

  render() {
    const { userStore, appStore, runtimeStore, clusterStore, repoStore, t } = this.props;
    const { userDetail, currentTag } = userStore;
    const clusters = clusterStore.clusters.toJSON();
    let toolbarOptions, tableOptions;

    switch (currentTag) {
      case 'Apps':
        toolbarOptions = {
          searchWord: appStore.searchWord,
          placeholder: t('Search App'),
          onSearch: appStore.onSearch,
          onClear: appStore.onClearSearch,
          onRefresh: appStore.onRefresh
        };
        tableOptions = {
          columns: appColumns,
          dataSource: appStore.apps.toJSON(),
          isLoading: appStore.isLoading,
          filterList: [
            {
              key: 'status',
              conditions: [
                { name: t('Active'), value: 'active' },
                { name: t('Deleted'), value: 'deleted' }
              ],
              onChangeFilter: appStore.onChangeStatus,
              selectValue: appStore.selectStatus
            }
          ],
          pagination: {
            tableType: 'Apps',
            onChange: appStore.changePagination,
            total: appStore.totalCount,
            current: appStore.currentPage
          }
        };
        break;
      case 'Clusters':
        toolbarOptions = {
          searchWord: clusterStore.searchWord,
          placeholder: t('Search Clusters'),
          onSearch: clusterStore.onSearch,
          onClear: clusterStore.onClearSearch,
          onRefresh: clusterStore.onRefresh
        };
        tableOptions = {
          columns: clusterColumns([], []),
          dataSource: clusterStore.clusters.toJSON(),
          isLoading: clusterStore.isLoading,
          filterList: [
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
          ],
          pagination: {
            tableType: 'Clusters',
            onChange: clusterStore.changePagination,
            total: clusterStore.totalCount,
            current: clusterStore.currentPage
          }
        };
        break;
      case 'Runtimes':
        toolbarOptions = {
          searchWord: runtimeStore.searchWord,
          placeholder: t('Search Runtimes'),
          onSearch: runtimeStore.onSearch,
          onClear: runtimeStore.onClearSearch,
          onRefresh: runtimeStore.onRefresh
        };
        tableOptions = {
          columns: runtimesColumns(clusters),
          dataSource: runtimeStore.runtimes.toJSON(),
          isLoading: runtimeStore.isLoading,
          filterList: [
            {
              key: 'status',
              conditions: [
                { name: t('Active'), value: 'active' },
                { name: t('Deleted'), value: 'deleted' }
              ],
              onChangeFilter: runtimeStore.onChangeStatus,
              selectValue: runtimeStore.selectStatus
            }
          ],
          pagination: {
            tableType: 'Runtimes',
            onChange: runtimeStore.changePagination,
            total: runtimeStore.totalCount,
            current: runtimeStore.currentPage
          }
        };
        break;
      case 'Repos':
        toolbarOptions = {
          searchWord: repoStore.searchWord,
          placeholder: t('Search Repos'),
          onSearch: repoStore.onSearch,
          onClear: repoStore.onClearSearch,
          onRefresh: repoStore.onRefresh
        };

        tableOptions = {
          columns: repoColumns,
          dataSource: repoStore.repos.toJSON(),
          isLoading: repoStore.isLoading,
          filterList: [
            {
              key: 'status',
              conditions: [
                { name: t('Active'), value: 'active' },
                { name: t('Deleted'), value: 'deleted' }
              ],
              onChangeFilter: repoStore.onChangeStatus,
              selectValue: repoStore.selectStatus
            }
          ],
          pagination: {
            tableType: 'Repos',
            onChange: repoStore.changePagination,
            total: repoStore.totalCount,
            current: repoStore.currentPage
          }
        };
        break;
    }

    return (
      <Layout backBtn={<BackBtn label="users" link="/dashboard/users" />}>
        <Grid>
          <Section>
            <Card>
              <UserCard userDetail={userDetail} />
              {userDetail.status !== 'deleted' && (
                <Popover className="operation" content={this.renderHandleMenu(userDetail.user_id)}>
                  <Icon name="more" />
                </Popover>
              )}
            </Card>
          </Section>
          <Section size={8}>
            <Panel>
              <TagNav
                tags={['Apps', 'Clusters', 'Runtimes', 'Repos']}
                changeTag={this.changeDetailTab}
              />
              <Card>
                {this.renderToolbar(toolbarOptions)}
                {this.renderTable(tableOptions)}
              </Card>
            </Panel>
          </Section>
        </Grid>
      </Layout>
    );
  }
}

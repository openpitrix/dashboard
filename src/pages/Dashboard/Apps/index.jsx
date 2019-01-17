import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import { setPage } from 'mixins';

import Layout from 'components/Layout';
import EnhanceTable from 'components/EnhanceTable';
import Toolbar from 'components/Toolbar';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore,
  repoStore: rootStore.repoStore,
  userStore: rootStore.userStore,
  user: rootStore.user
}))
@setPage('appStore')
@observer
export default class Apps extends Component {
  async componentDidMount() {
    const {
      appStore, userStore, user, categoryStore, repoStore
    } = this.props;
    const { isAdmin } = user;

    // preset default status
    appStore.defaultStatus = ['active'];
    await appStore.fetchAll();

    if (isAdmin) {
      await userStore.fetchAll({ noLimit: true });
    }
    await repoStore.fetchAll({
      status: ['active', 'deleted'],
      noLimit: true
    });
    await categoryStore.fetchAll();
  }

  componentWillUnmount() {
    const { appStore } = this.props;
    appStore.reset();
    appStore.defaultStatus = '';
  }

  render() {
    const {
      appStore, userStore, user, t
    } = this.props;
    const {
      apps,
      isLoading,
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh
    } = appStore;
    const { users } = userStore;
    const { isAdmin } = user;
    const urlPrefix = '/dashboard/app/';
    const columnsFilter = columns => {
      const excludeKeys = isAdmin ? 'owner' : 'maintainers';
      return columns.filter(item => item.key !== excludeKeys);
    };

    return (
      <Layout pageTitle={t('All Apps')}>
        <Toolbar
          placeholder={t('Search App Name or ID')}
          searchWord={searchWord}
          onSearch={onSearch}
          onClear={onClearSearch}
          onRefresh={onRefresh}
        />

        <EnhanceTable
          isLoading={isLoading}
          store={appStore}
          data={apps}
          columnsFilter={columnsFilter}
          inject={{
            users,
            isAdmin,
            urlPrefix
          }}
        />
      </Layout>
    );
  }
}

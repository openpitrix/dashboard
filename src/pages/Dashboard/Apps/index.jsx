import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { setPage } from 'mixins';

import Layout from 'components/Layout';
import EnhanceTable from 'components/EnhanceTable';
import Toolbar from 'components/Toolbar';

import styles from './index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  clusterStore: rootStore.clusterStore,
  userStore: rootStore.userStore,
  user: rootStore.user
}))
@setPage('appStore')
@observer
export default class Apps extends Component {
  async componentDidMount() {
    const { appStore, user } = this.props;

    appStore.defaultStatus = ['active', 'suspended'];
    appStore.attchDeployTotal = true; // for query deploy total

    if (user.isISV) {
      appStore.attchUser = true;
    }
    await appStore.fetchAll();
  }

  componentWillUnmount() {
    const { appStore, clusterStore } = this.props;
    appStore.reset();
    clusterStore.reset();
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
    const columnsFilter = columns => {
      const excludeKeys = isAdmin ? 'owner' : 'maintainers';
      return columns.filter(item => item.key !== excludeKeys);
    };

    return (
      <Layout pageTitle={t('All Apps')} className={styles.appList}>
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
            isAdmin
          }}
        />
      </Layout>
    );
  }
}

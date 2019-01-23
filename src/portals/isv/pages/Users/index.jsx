import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Button, Icon } from 'components/Base';
import Layout from 'components/Layout';
import EnhanceTable from 'components/EnhanceTable';
import Toolbar from 'components/Toolbar';
import columns from './columns';
import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  userStore: rootStore.userStore
}))
@observer
export default class Users extends Component {
  async componentDidMount() {
    const { userStore } = this.props;

    await userStore.fetchAll();
  }

  renderHandleMenu() {
    return null;
  }

  renderToolbar() {
    const { t } = this.props;

    return (
      <Toolbar placeholder={t('Search app name or ID')} noRefreshBtn>
        <Button type="primary" className={styles.floatRight}>
          <Icon name="add" type="white" />
          {t('Add')}
        </Button>
      </Toolbar>
    );
  }

  render() {
    const { userStore, t } = this.props;
    const { users, isLoading } = userStore;

    return (
      <Layout
        isCenterPage
        centerWidth={772}
        isLoading={isLoading}
        pageTitle="All members"
      >
        {this.renderToolbar()}
        <EnhanceTable
          tableType="TeamMembers"
          columns={columns(t, this.renderHandleMenu)}
          data={users}
          store={userStore}
        />
      </Layout>
    );
  }
}

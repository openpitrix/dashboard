import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Button, Icon } from 'components/Base';
import Layout from 'components/Layout';
import EnhanceTable from 'components/EnhanceTable';
import Toolbar from 'components/Toolbar';
import columns, { filterList } from './columns';
import Modals from './Modals';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  userStore: rootStore.userStore,
  userDetailStore: rootStore.userDetailStore,
  modalStore: rootStore.modalStore
}))
@observer
export default class Users extends Component {
  async componentDidMount() {
    const { userStore, userDetailStore } = this.props;

    await userDetailStore.fetchAll();
    await userStore.fetchRoles();
  }

  renderHandleMenu() {
    return null;
  }

  handleAction(type, e) {
    e.stopPropagation();
    e.preventDefault();
    const { modalStore } = this.props;
    modalStore.show(type);
  }

  renderToolbar() {
    const { t } = this.props;

    return (
      <Toolbar placeholder={t('Search app name or ID')} noRefreshBtn>
        <Button
          onClick={e => this.handleAction('renderModalCreateUser', e)}
          type="primary"
          className={styles.floatRight}
        >
          <Icon name="add" type="white" />
          {t('Add')}
        </Button>
      </Toolbar>
    );
  }

  render() {
    const {
      userStore, userDetailStore, modalStore, t
    } = this.props;
    const { users, isLoading } = userDetailStore;

    return (
      <Layout isCenterPage isLoading={isLoading} pageTitle="All members">
        {this.renderToolbar()}
        <EnhanceTable
          tableType="TeamMembers"
          columns={columns(t, this.renderHandleMenu)}
          data={users}
          store={userDetailStore}
          filterList={filterList(t, userDetailStore)}
        />
        <Modals
          t={t}
          userStore={userStore}
          userDetailStore={userDetailStore}
          modalStore={modalStore}
        />
      </Layout>
    );
  }
}

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import { Button, Icon } from 'components/Base';
import Layout from 'components/Layout';
import EnhanceTable from 'components/EnhanceTable';
import Toolbar from 'components/Toolbar';
import { PORTAL_NAME } from 'config/roles';
import Modals from 'portals/admin/pages/Users/Modals';
import columns, { filterList } from './columns';

import styles from './index.scss';

@withTranslation()
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

  renderHandleMenu = user => {
    const { modalStore, t } = this.props;
    const isISVAdmin = _.get(user, 'role.role_id') === PORTAL_NAME.isv;

    return (
      <div className="operate-menu">
        <span
          onClick={() => modalStore.show(
            'renderModalCreateUser',
            _.assign({}, user, {
              password: null
            })
          )
          }
        >
          {t('Edit info')}
        </span>
        <span onClick={() => modalStore.show('renderModalResetPassword', user)}>
          {t('Change Password')}
        </span>
        {!isISVAdmin && (
          <span onClick={() => modalStore.show('renderModalSetRole', user)}>
            {t('Set role')}
          </span>
        )}
      </div>
    );
  };

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
          isISV
          t={t}
          userStore={userStore}
          userDetailStore={userDetailStore}
          modalStore={modalStore}
        />
      </Layout>
    );
  }
}

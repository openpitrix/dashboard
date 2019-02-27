import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import { Input, Select } from 'components/Base';

import { Dialog } from 'components/Layout';
import EnhanceTable from 'components/EnhanceTable';
import Toolbar from 'components/Toolbar';

import columns, { filterList } from '../columns';

import styles from '../index.scss';

const emailRegexp = '^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,4}$';

@observer
export default class UserModalActions extends Component {
  get selectedIds() {
    return this.props.userStore.selectIds;
  }

  get userNames() {
    return this.props.userStore.userNames;
  }

  get selectedGroupIds() {
    return this.props.groupStore.selectedGroupIds;
  }

  renderModalCreateGroup() {
    const { t, modalStore, groupStore } = this.props;
    const { hide, isOpen } = modalStore;
    const { createGroup } = groupStore;

    return (
      <Dialog
        title={t('Create group')}
        visible={isOpen}
        width={744}
        onSubmit={createGroup}
        onCancel={hide}
      >
        <Input
          name="parent_group_id"
          type="hidden"
          value={_.first(this.selectedGroupIds)}
        />
        <Input name="description" type="hidden" />
        <div className={styles.formItem}>
          <label>{t('Group name')}</label>
          <Input name="name" />
        </div>
      </Dialog>
    );
  }

  renderModalDeleteGroup() {
    const { t, modalStore, groupStore } = this.props;
    const { hide, isOpen } = modalStore;
    const { deleteGroup, groupName } = groupStore;
    return (
      <Dialog
        title={t('Delete group')}
        visible={isOpen}
        width={744}
        onSubmit={deleteGroup}
        onCancel={hide}
      >
        <div>
          {t('Do you sure to delete groupName', {
            groupName
          })}
        </div>
        <div className={styles.tips}>{t('DELETE_GROUP_TIP')}</div>
        <Input name="group_id" type="hidden" value={this.selectedGroupIds} />
      </Dialog>
    );
  }

  renderModalRenameGroup() {
    const { t, modalStore, groupStore } = this.props;
    const { hide, isOpen } = modalStore;
    const { renameGroup, groupName } = groupStore;
    return (
      <Dialog
        title={t('Rename group')}
        visible={isOpen}
        width={744}
        onSubmit={renameGroup}
        onCancel={hide}
      >
        <Input
          name="group_id"
          type="hidden"
          value={_.first(this.selectedGroupIds)}
        />
        <div className={styles.formItem}>
          <label>{t('Group name')}</label>
          <Input name="name" defaultValue={groupName} />
        </div>
      </Dialog>
    );
  }

  renderModalJoinGroup() {
    const { t, modalStore, groupStore } = this.props;
    const { hide, isOpen } = modalStore;
    const { joinGroup, users } = groupStore;
    return (
      <Dialog
        width={744}
        title={t('Add user')}
        visible={isOpen}
        onSubmit={joinGroup}
        onCancel={hide}
      >
        <Toolbar
          noRefreshBtn
          placeholder={t('Search users')}
          searchWord={groupStore.searchWord}
          onSearch={groupStore.onSearch}
          onClear={groupStore.onClearSearch}
        />
        <EnhanceTable
          hasRowSelection
          isLoading={groupStore.isLoading}
          store={groupStore}
          data={users}
          columns={columns(t)}
          filterList={filterList(t, groupStore)}
        />
      </Dialog>
    );
  }

  renderModalLeaveGroup() {
    const {
      t, modalStore, groupStore, userStore
    } = this.props;
    const { hide, isOpen } = modalStore;
    const { users } = userStore;
    const { leaveGroup } = groupStore;
    let names = _.flatMap(
      users.filter(user => this.selectedIds.includes(user.user_id)),
      'username'
    );
    let count = null;
    if (names.length > 3) {
      count = `${names.length} ${t('count')}`;
      names = names.slice(3);
    }

    return (
      <Dialog
        width={744}
        title={t('Leave group')}
        visible={isOpen}
        onSubmit={leaveGroup}
        onCancel={hide}
      >
        <div>
          {t('Do you sure to leaveGroup groupName', {
            names,
            count
          })}
        </div>
      </Dialog>
    );
  }

  renderModalSetRole() {
    const { userStore, modalStore, t } = this.props;
    const { isOpen, hide, item } = modalStore;
    const { setRole, createRoles } = userStore;
    const roleId = _.get(item, 'role.role_id', '');
    const userId = _.get(item, 'user_id') || this.selectedIds.join(',');
    const isMultip = _.get(item, 'user_id');
    const names = isMultip ? item.username : this.userNames;
    const text = isMultip
      ? t('Set_Role_Title', { names })
      : t('Set_Role_Title_For_Multi_User', {
        count: names.length,
        names: names.slice(0, 3).join(',')
      });

    return (
      <Dialog
        width={744}
        title={t('Set role')}
        isOpen={isOpen}
        onCancel={hide}
        onSubmit={setRole}
      >
        <div className={styles.formTitle}>{text}</div>
        <div>
          <input name="user_id" value={userId} type="hidden" />
          <Select defaultValue={roleId} name="role_id">
            {createRoles.map(({ role_id, role_name }) => (
              <Select.Option key={role_id} value={role_id}>
                {t(role_name)}
              </Select.Option>
            ))}
          </Select>
        </div>
      </Dialog>
    );
  }

  renderModalCreateUser() {
    const { userStore, modalStore, t } = this.props;
    const { isOpen, item } = modalStore;
    const { hideModifyUser, createOrModify } = userStore;
    const { user_id, username, email } = item;
    const roles = userStore.createRoles;

    const title = !user_id ? t('Create New User') : t('Modify User');

    return (
      <Dialog
        width={744}
        title={title}
        isOpen={isOpen}
        onCancel={hideModifyUser}
        onSubmit={createOrModify}
      >
        {user_id && (
          <div className={styles.formItem}>
            <label>{t('Name')}</label>
            <Input
              name="name"
              maxLength="50"
              defaultValue={username}
              required
            />
            <Input name="user_id" type="hidden" defaultValue={user_id} />
          </div>
        )}
        <div className={styles.formItem}>
          <label>{t('Email')}</label>
          <Input
            name="email"
            maxLength={50}
            placeholer="username@example.com"
            defaultValue={email}
            pattern={emailRegexp}
            required
          />
        </div>
        {!user_id && (
          <Fragment>
            <div className={styles.formItem}>
              <label>{t('Role')}</label>
              <Select defaultValue={_.get(roles, '[0].role_id')} name="role_id">
                {roles.map(({ role_id, role_name }) => (
                  <Select.Option key={role_id} value={role_id}>
                    {t(role_name)}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className={styles.formItem}>
              <label>{t('Password')}</label>
              <Input name="password" type="password" maxLength={50} />
            </div>
          </Fragment>
        )}
        <div className={styles.formItemText}>
          <label>{t('Description')}</label>
          <textarea name="description" maxLength={500} />
        </div>
      </Dialog>
    );
  }

  renderModalResetPassword() {
    const { t, modalStore, userStore } = this.props;
    const { hide, isOpen, item } = modalStore;
    const { changePwd } = userStore;

    return (
      <Dialog
        title={t('Change Password')}
        visible={isOpen}
        width={744}
        onSubmit={changePwd}
        onCancel={hide}
      >
        <div className={styles.formTitle}>
          {t('Change password for user', item)}
        </div>

        <div className={styles.formItem}>
          <Input name="user_id" type="hidden" defaultValue={item.user_id} />
          <Input name="password" type="password" maxLength={50} />
        </div>
      </Dialog>
    );
  }

  renderModalDeleteUser() {
    const { t, modalStore, userStore } = this.props;
    const { hide, isOpen, item } = modalStore;
    const { remove } = userStore;
    userStore.userId = item.type === 'one' ? [item.user_id] : this.selectedIds;

    return (
      <Dialog
        title={t('Create group')}
        visible={isOpen}
        onSubmit={remove}
        onCancel={hide}
      >
        {t('delete_user_desc')}
      </Dialog>
    );
  }

  render() {
    const { modalStore } = this.props;
    const { isOpen, type } = modalStore;
    if (!isOpen || !type) {
      return null;
    }

    if (typeof this[type] === 'function') {
      return this[type]();
    }

    return null;
  }
}

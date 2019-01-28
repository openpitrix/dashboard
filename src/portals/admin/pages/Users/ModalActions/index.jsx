import React, { Component } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import { Input, Select } from 'components/Base';

import { Dialog } from 'components/Layout';
import EnhanceTable from 'components/EnhanceTable';

import columns from '../columns';
import styles from '../index.scss';

const emailRegexp = '^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,4}$';

@observer
export default class UserModalActions extends Component {
  renderModalCreateGroup() {
    const { t, modalStore, userStore } = this.props;
    const { hide, isOpen } = modalStore;
    const { createGroup, selectedGroupIds } = userStore;

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
          value={_.first(selectedGroupIds)}
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
    const { t, modalStore, userStore } = this.props;
    const { hide, isOpen } = modalStore;
    const { deleteGroup, selectedGroupIds, groupName } = userStore;
    return (
      <Dialog
        title={t('Delete group')}
        visible={isOpen}
        width={744}
        onSubmit={deleteGroup}
        onCancel={hide}
      >
        <div>
          {t('Do you sure to delete $groupName', {
            groupName
          })}
        </div>
        <div className={styles.tips}>{t('DELETE_GROUP_TIP')}</div>
        <Input name="group_id" type="hidden" value={selectedGroupIds} />
      </Dialog>
    );
  }

  renderModalRenameGroup() {
    const { t, modalStore, userStore } = this.props;
    const { hide, isOpen } = modalStore;
    const { renameGroup, selectedGroupIds, groupName } = userStore;
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
          value={_.first(selectedGroupIds)}
        />
        <div className={styles.formItem}>
          <label>{t('Group name')}</label>
          <Input name="name" defaultValue={groupName} />
        </div>
      </Dialog>
    );
  }

  renderModalJoinGroup() {
    const { t, modalStore, userStore } = this.props;
    const { hide, isOpen } = modalStore;
    const { joinGroup, noGroupUsers } = userStore;
    return (
      <Dialog
        width={744}
        title={t('Add user')}
        visible={isOpen}
        onSubmit={joinGroup}
        onCancel={hide}
      >
        <EnhanceTable
          hasRowSelection
          rowKey="user_id"
          isLoading={userStore.isLoading}
          store={userStore}
          data={noGroupUsers}
          columns={columns(t)}
        />
      </Dialog>
    );
  }

  renderModalLeaveGroup() {
    const { t, modalStore, userStore } = this.props;
    const { hide, isOpen } = modalStore;
    const { leaveGroup, users, selectedRowKeys } = userStore;
    let names = _.flatMap(
      users.filter(user => selectedRowKeys.includes(user.user_id)),
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
          {t('Do you sure to leaveGroup $groupName', {
            names,
            count
          })}
        </div>
      </Dialog>
    );
  }

  renderModalCreateUser() {
    const { userStore, modalStore, t } = this.props;
    const { isOpen } = modalStore;
    const {
      userDetail,
      operateType,
      hideModifyUser,
      createOrModify
    } = userStore;
    const {
      user_id, role, username, email
    } = userDetail;

    const title = operateType === 'modify' ? t('Modify User') : t('Create New User');

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
        <div className={styles.formItem}>
          <label>{t('Role')}</label>
          <Select defaultValue={role} name="role">
            <Select.Option value="user">{t('Normal User')}</Select.Option>
            <Select.Option value="developer">{t('Developer')}</Select.Option>
            <Select.Option value="global_admin">
              {t('Administrator')}
            </Select.Option>
            <Select.Option value="isv">{t('ISV')}</Select.Option>
          </Select>
        </div>
        <div className={styles.formItem}>
          <label>{t('Password')}</label>
          <Input name="password" type="password" maxLength={50} />
        </div>
        <div className={styles.formItemText}>
          <label>{t('Description')}</label>
          <textarea name="description" maxLength={500} />
        </div>
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

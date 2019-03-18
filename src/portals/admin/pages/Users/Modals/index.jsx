import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import classnames from 'classnames';

import { Input, Select, Tree } from 'components/Base';

import { Dialog } from 'components/Layout';
import { PORTAL_NAME, getRoleName, getRoleDescription } from 'config/roles';

import styles from '../index.scss';

const emailRegexp = '^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,4}$';

@observer
export default class UserModalActions extends Component {
  state = {
    roleId: ''
  };

  get selectedIds() {
    return this.props.userDetailStore.selectIds;
  }

  get userNames() {
    return this.props.userDetailStore.userNames;
  }

  get selectedGroupIds() {
    return this.props.groupStore.selectedGroupIds;
  }

  get roleProtal() {
    return this.props.isISV ? PORTAL_NAME.isv : PORTAL_NAME.admin;
  }

  renderModalCreateGroup() {
    const { t, modalStore, groupStore } = this.props;
    const { hide, isOpen } = modalStore;
    const { createGroup } = groupStore;
    return (
      <Dialog
        title={t('Create new organization')}
        visible={isOpen}
        width={744}
        onSubmit={createGroup}
        okText={t('Add')}
        onCancel={hide}
      >
        <Input
          name="parent_group_id"
          type="hidden"
          value={_.first(this.selectedGroupIds)}
        />
        <div className={styles.formItem}>
          {t('GROUP_POSITION', {
            position: groupStore.position
          })}
        </div>

        <Input name="description" type="hidden" />
        <div className={styles.formItem}>
          <Input placeholder={t('Group name')} name="name" />
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
        title={t('Tips')}
        visible={isOpen}
        width={744}
        onSubmit={deleteGroup}
        okText={t('Delete')}
        onCancel={hide}
      >
        <div className={styles.formItem}>
          {t('SELECT_GROUP', {
            position: `${groupStore.parentPosition} / `
          })}

          <strong>{groupName}</strong>
        </div>
        <div className={styles.tips}>{t('DELETE_GROUP_TIP')}</div>
        <Input
          name="group_id"
          type="hidden"
          defaultValue={_.first(this.selectedGroupIds)}
        />
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
          defaultValue={_.first(this.selectedGroupIds)}
        />
        <div className={styles.formItem}>
          {t('GROUP_POSITION', {
            position: groupStore.parentPosition
          })}
        </div>
        <div className={styles.formItem}>
          <Input name="name" defaultValue={groupName} />
        </div>
      </Dialog>
    );
  }

  renderModalSetGroup() {
    const { t, modalStore, groupStore } = this.props;
    const { hide, isOpen } = modalStore;
    const { joinGroup, joinGroupTreeData, onSelectJoinGroupOrg } = groupStore;
    return (
      <Dialog
        width={744}
        title={t('Set group')}
        visible={isOpen}
        onSubmit={joinGroup}
        onCancel={() => {
          groupStore.selectedJoinGroupIds = [];
          hide();
        }}
      >
        <Tree
          defaultExpandAll
          showLine
          hoverLine
          className={styles.setRoleTree}
          selectedKeys={groupStore.selectedJoinGroupIds}
          renderTreeTitle={node => t(node.title)}
          onSelect={onSelectJoinGroupOrg}
          treeData={joinGroupTreeData}
        />
      </Dialog>
    );
  }

  onChangeRole = roleId => {
    this.setState({ roleId });
  };

  resetRoleId = () => {
    this.setState({
      roleId: ''
    });
  };

  renderModalSetRole() {
    const {
      userStore, userDetailStore, modalStore, t
    } = this.props;
    const { isOpen, hide, item } = modalStore;
    const { setRole, createRoles } = userDetailStore;
    const roles = this.props.isISV ? userStore.isvRoles : createRoles;
    const roleId = _.get(item, 'role.role_id', '');
    const userId = _.get(item, 'user_id') || this.selectedIds.join(',');
    const isMultip = _.get(item, 'user_id');
    const names = isMultip ? item.username : this.userNames;
    const text = isMultip
      ? t('Set_Role_Title', { names })
      : t('Set_Role_Title_For_Multi_User', {
        count: names.length,
        names: names.slice(0, 3).join(','),
        interpolation: {
          escapeValue: false
        }
      });
    const defaultRole = _.get(item, 'role', {});
    const selectedRole = _.find(roles, { role_id: this.state.roleId });
    return (
      <Dialog
        width={744}
        title={t('Set role')}
        isOpen={isOpen}
        onCancel={() => {
          this.resetRoleId();
          hide();
        }}
        onSubmit={setRole}
      >
        <div className={styles.formTitle}>{text}</div>
        <div>
          <input name="user_id" value={userId} type="hidden" />
          <Select
            defaultValue={roleId}
            onChange={this.onChangeRole}
            name="role_id"
          >
            {roles.map(role => (
              <Select.Option key={role.role_id} value={role.role_id}>
                {t(getRoleName(role, this.roleProtal))}
              </Select.Option>
            ))}
          </Select>
          <div className={styles.description}>
            {t(
              getRoleDescription(selectedRole || defaultRole, this.roleProtal)
            )}
          </div>
        </div>
      </Dialog>
    );
  }

  renderModalCreateUser() {
    const {
      userStore, userDetailStore, modalStore, isISV, t
    } = this.props;
    const { isOpen, item } = modalStore;
    const { hideModifyUser, createOrModify } = userStore;
    const {
      user_id, username, description, email
    } = item;
    const { createRoles } = userDetailStore;
    const roles = this.props.isISV ? userStore.isvRoles : createRoles;

    const title = !user_id ? t('Create New User') : t('Modify User');
    const defaultRole = _.get(roles, '[0]', {});
    const selectedRole = _.find(roles, { role_id: this.state.roleId });

    return (
      <Dialog
        width={744}
        title={title}
        isOpen={isOpen}
        onCancel={() => {
          this.resetRoleId();
          hideModifyUser();
        }}
        onSubmit={(e, data) => createOrModify(e, data, isISV)}
      >
        {user_id && (
          <div className={styles.formItem}>
            <label>{t('Name')}</label>
            <Input
              name="username"
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
            <div className={classnames(styles.formItem, styles.setRoleFrom)}>
              <label>{t('Role')}</label>
              <Select
                defaultValue={_.get(roles, '[0].role_id')}
                name="role_id"
                onChange={this.onChangeRole}
              >
                {roles.map(role => (
                  <Select.Option key={role.role_id} value={role.role_id}>
                    {t(getRoleName(role, this.roleProtal))}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className={styles.formItem}>
              <label />
              <div className={styles.description}>
                {t(
                  getRoleDescription(
                    selectedRole || defaultRole,
                    this.roleProtal
                  )
                )}
              </div>
            </div>
            <div className={styles.formItem}>
              <label>{t('Password')}</label>
              <Input name="password" type="password" maxLength={50} />
            </div>
          </Fragment>
        )}
        <div className={styles.formItemText}>
          <label>{t('Description')}</label>
          <textarea
            name="description"
            maxLength={500}
            defaultValue={description}
          />
        </div>
      </Dialog>
    );
  }

  renderModalResetPassword() {
    const { t, modalStore, userStore } = this.props;
    const { hide, isOpen, item } = modalStore;
    const { createOrModify } = userStore;

    return (
      <Dialog
        title={t('Change Password')}
        visible={isOpen}
        width={744}
        onSubmit={createOrModify}
        onCancel={hide}
      >
        <div className={styles.formTitle}>
          {t('Change password for user', item)}
        </div>

        <div className={styles.formItem}>
          <Input name="user_id" type="hidden" defaultValue={item.user_id} />
          <Input name="password" type="password" maxLength={50} />
          <Input
            name="email"
            type="hidden"
            defaultValue={item.email}
            required
          />
        </div>
      </Dialog>
    );
  }

  renderModalDeleteUser() {
    const { t, modalStore, userDetailStore } = this.props;
    const { hide, isOpen, item } = modalStore;
    const { remove } = userDetailStore;
    userDetailStore.userId = item.type === 'one' ? [item.user_id] : this.selectedIds;

    return (
      <Dialog
        title={t('Create group')}
        visible={isOpen}
        onSubmit={remove}
        onCancel={hide}
        okText={t('Delete')}
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

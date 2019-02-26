import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { Input, Button, Icon } from 'components/Base';

import { Dialog } from 'components/Layout';
import styles from '../index.scss';

@observer
export default class RoleModalActions extends Component {
  renderModalDeleteRole() {
    const { modalStore, roleStore, t } = this.props;
    const { isOpen, hide } = modalStore;
    const { roleName, deleteRole } = roleStore;

    return (
      <Dialog
        title={t('Delete role')}
        width={744}
        isOpen={isOpen}
        onCancel={hide}
        onSubmit={deleteRole}
      >
        <div>
          <h3>
            {t('Do you sure to delete roleName', {
              roleName
            })}
          </h3>
        </div>
      </Dialog>
    );
  }

  renderModalCreateRoleSuccess() {
    const { modalStore, roleStore, t } = this.props;
    const { isOpen, hide } = modalStore;
    const { setBindAction } = roleStore;

    return (
      <Dialog
        noActions
        title={t('Tips')}
        width={744}
        isOpen={isOpen}
        onCancel={hide}
      >
        <div className={styles.roleSuccess}>
          <Icon
            className={styles.checkedIcon}
            name="checked-circle"
            size={48}
          />
          <h3>{t('Create role success')}</h3>
          <div>{t('Create_Role_Success_Tip')}</div>
          <div>
            <Button type="primary" onClick={setBindAction}>
              {t('Set permission')}
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }

  renderModalCreateRole() {
    const { modalStore, roleStore, t } = this.props;
    const { isOpen, hide, item } = modalStore;
    const { createRole } = roleStore;
    const { handleType } = item;
    const title = handleType === 'edit' ? t('Edit info') : t('Create admin role');

    return (
      <Dialog
        className={styles.form}
        title={title}
        width={744}
        isOpen={isOpen}
        onCancel={hide}
        onSubmit={createRole}
      >
        <div className={styles.fmCtrl}>
          <label>{t('Role Name')}</label>
          <Input
            className={styles.input}
            name="role_name"
            defaultValue={item.role_name}
          />
        </div>
        <div className={styles.textareaItem}>
          <label>{t('Description')}</label>
          <textarea name="description" defaultValue={item.description} />
        </div>
        {handleType === 'edit' && (
          <Input name="role_id" value={item.role_id} type="hidden" />
        )}
        <Input name="portal" value="global_admin" type="hidden" />
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

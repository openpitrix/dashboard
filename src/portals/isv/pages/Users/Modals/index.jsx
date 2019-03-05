import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import { Input, Select } from 'components/Base';

import { Dialog } from 'components/Layout';

import styles from '../index.scss';

const emailRegexp = '^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,4}$';

@observer
export default class RoleModalActions extends Component {
  renderModalCreateUser() {
    const { userStore, modalStore, t } = this.props;
    const { isOpen, item } = modalStore;
    const { hideModifyUser, createOrModify } = userStore;
    const {
      user_id, username, description, email
    } = item;
    const roles = userStore.isvRoles;

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
          <textarea
            name="description"
            maxLength={500}
            defaultValue={description}
          />
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

import React, { Component, Fragment } from 'react';
import { translate } from 'react-i18next';

import { Icon } from 'components/Base';

import styles from './index.scss';

@translate()
export default class RoleItem extends Component {
  get isGlobalAdmin() {
    return this.props.role_id === 'global_admin';
  }

  get description() {
    const {
      t, description, isAdmin, role_id
    } = this.props;
    const text = this.isGlobalAdmin
      ? t('Global Admin Role description')
      : description;
    return (
      <span>
        {text}
        {!isAdmin && (
          <Fragment>
            {t(`Normal_Role_Description_${role_id}`)}
            <span className={styles.normalPermission}>
              {t("Can't delete, can edit")}
            </span>
          </Fragment>
        )}
      </span>
    );
  }

  showCreateModal = () => {
    this.props.modalStore.show('renderModalCreateRole');
  };

  renderCreateBtn() {
    const { title } = this.props;
    return (
      <span onClick={this.showCreateModal} className={styles.btnCreate}>
        <Icon className={styles.btnIcon} name="add" size={14} />
        {title}
      </span>
    );
  }

  render() {
    const { isGlobalAdmin, description } = this;
    const { t, title, type } = this.props;
    if (type === 'create_btn') {
      return this.renderCreateBtn();
    }
    return (
      <span className={styles.roleItem}>
        <strong>
          {t(title)}
          {isGlobalAdmin && (
            <Icon className={styles.lockIcon} type="dark" name="lock" />
          )}
        </strong>
        <br />
        {description}
      </span>
    );
  }
}

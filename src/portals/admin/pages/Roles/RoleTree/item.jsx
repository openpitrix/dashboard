import React, { Component } from 'react';
import { translate } from 'react-i18next';

import { Icon } from 'components/Base';

import styles from './index.scss';

@translate()
export default class RoleItem extends Component {
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
    const {
      t, title, description, type, isGlobalAdmin, isAdmin
    } = this.props;
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
        <span>
          {description}
          {!isAdmin && (
            <span className={styles.normalPermission}>不可删除，可以编辑</span>
          )}
        </span>
      </span>
    );
  }
}

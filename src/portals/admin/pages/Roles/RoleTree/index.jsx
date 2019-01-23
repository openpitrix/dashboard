import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import {
  Input, Tree
} from 'components/Base';

import { Dialog } from 'components/Layout';

import Item from './item';

import styles from './index.scss';

@translate()
@observer
export default class RoleTree extends Component {
  getTreeData({ roleStore, pageStore }) {
    const adminRoles = roleStore.roles.filter(
      ({ portal }) => portal === 'admin'
    );
    const normalRoles = roleStore.roles.filter(
      ({ portal }) => portal !== 'admin'
    );
    const navData = [
      {
        title: '管理员后台角色（1）',
        disabled: true
      },
      {
        title: '终端角色（2）',
        disabled: true
      }
    ];
    navData[0].children = adminRoles.map(role => ({
      key: role.role_id,
      title: (
        <Item
          isAdmin
          title={role.role_name}
          description={role.description}
          portal={role.portal}
          roleStore={roleStore}
        />
      )
    }));
    navData[0].children.push({
      key: 'create_role',
      disabled: true,
      title: (
        <Item
          type="create_btn"
          title="自定义"
          roleStore={roleStore}
          pageStore={pageStore}
        />
      )
    });
    navData[1].children = normalRoles.map(role => ({
      key: role.role_id,
      title: (
        <Item
          title={role.role_name}
          description={role.description}
          portal={role.portal}
          roleStore={roleStore}
        />
      )
    }));
    return navData;
  }

  renderModals() {
    const { pageStore, roleStore, t } = this.props;
    const { isModalOpen, modalType, hideModal } = pageStore;
    const { createRole } = roleStore;

    if (modalType === 'create_role') {
      return (
        <Dialog
          className={styles.form}
          title={t('Create admin role')}
          width={744}
          isOpen={isModalOpen}
          onCancel={hideModal}
          onSubmit={createRole}
        >
          <div className={styles.fmCtrl}>
            <label>{t('Role Name')}</label>
            <Input className={styles.input} name="role_name" />
          </div>
          <div className={styles.textareaItem}>
            <label>{t('Description')}</label>
            <textarea name="description" />
          </div>
          <Input name="portal" value="admin" type="hidden" />
        </Dialog>
      );
    }
  }

  render() {
    const { roleStore, pageStore } = this.props;
    const { selectRole } = roleStore;
    return (
      <div>
        <Tree
          hoverLine
          defaultExpandAll
          selectable
          onSelect={selectRole}
          className={styles.tree}
          treeData={this.getTreeData({ roleStore, pageStore })}
        />
        {this.renderModals()}
      </div>
    );
  }
}

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import { Tree } from 'components/Base';

import { Dialog } from 'components/Layout';

import Item from './item';

import styles from './index.scss';

@translate()
@observer
export default class RoleTree extends Component {
  getTreeData(roleStore) {
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
      key: 'add',
      title: <Item type="createBtn" title="自定义" roleStore={roleStore} />
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
    const { roleStore, t } = this.props;
    const {
      isModalOpen, modalType, hideModal, handleOperation
    } = roleStore;

    if (modalType === 'delete_runtime') {
      return (
        <Dialog
          title={t('Create admin role')}
          isOpen={isModalOpen}
          onCancel={hideModal}
          onSubmit={handleOperation}
        >
          <p>{t('DELETE_RUNTIME_CONFIRM')}</p>
        </Dialog>
      );
    }
  }

  render() {
    const { roleStore } = this.props;
    const { selectRole } = roleStore;
    return (
      <div>
        <Tree
          hoverLine
          defaultExpandAll
          selectable
          onSelect={selectRole}
          className={styles.tree}
          treeData={this.getTreeData(roleStore)}
        />
      </div>
    );
  }
}

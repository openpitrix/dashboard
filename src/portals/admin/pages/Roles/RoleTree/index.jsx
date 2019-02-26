import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import { Tree } from 'components/Base';
import { getRoleName } from 'utils';

import Item from './item';

import styles from './index.scss';

const CannotEditController = 'pitrix';

@translate()
@observer
export default class RoleTree extends Component {
  getTreeData({ roleStore, modalStore }) {
    const { t } = this.props;
    const { sortRole } = roleStore;
    const normalPortal = ['user', 'isv'];
    const adminRoles = roleStore.roles
      .filter(({ portal }) => portal === 'global_admin')
      .sort(sortRole);

    const normalRoles = roleStore.roles.filter(
      ({ portal, controller }) => normalPortal.includes(portal) && controller === CannotEditController
    );
    const navData = [
      {
        className: styles.treeNodeAdmin,
        title: t('Admin Role Title Count', {
          count: adminRoles.length
        }),
        key: 'admin_role',
        disabled: true
      },
      {
        title: t('Normal Role Title Count', {
          count: normalRoles.length
        }),
        key: 'not_admin_role',
        disabled: true
      }
    ];
    navData[0].children = adminRoles.map(role => ({
      key: role.role_id,
      title: (
        <Item
          isAdmin
          key={`title_${role.role_id}`}
          role_id={role.role_id}
          title={getRoleName(role)}
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
          key={`title_create_role`}
          type="create_btn"
          title="自定义"
          roleStore={roleStore}
          modalStore={modalStore}
        />
      )
    });
    navData[1].children = normalRoles.map(role => ({
      key: role.role_id,
      title: (
        <Item
          key={`title_${role.role_id}`}
          role_id={role.role_id}
          title={getRoleName(role)}
          description={role.description}
          portal={role.portal}
          roleStore={roleStore}
        />
      )
    }));
    return navData;
  }

  render() {
    const { roleStore, modalStore } = this.props;
    const { onSelectRole, selectedRoleKeys } = roleStore;
    return (
      <div>
        <Tree
          hoverLine
          defaultExpandAll
          selectable
          keyName="role_id"
          onSelect={onSelectRole}
          selectedKeys={selectedRoleKeys}
          className={styles.tree}
          treeData={this.getTreeData({ roleStore, modalStore })}
        />
      </div>
    );
  }
}

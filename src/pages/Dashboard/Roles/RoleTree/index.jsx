import React, { Component } from 'react';

import { Tree } from 'components/Base';

import Item from './item';

import styles from './index.scss';

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

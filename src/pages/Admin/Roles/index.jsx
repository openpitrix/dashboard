import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import Rectangle from 'components/Rectangle';
import Layout from 'components/Layout/Admin';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  roleStore: rootStore.roleStore
}))
@observer
export default class Roles extends Component {
  static async onEnter({ roleStore }) {
    // todo: api 404
    // await roleStore.fetchRoles();
  }

  render() {
    const { roleStore } = this.props;
    const roleList = roleStore.roles.toJSON();

    return (
      <Layout>
        <div className={styles.pageTitle}>Roles</div>
        <div className={styles.categories}>
          <div className={styles.line}>
            <div className={styles.word}>Default ({roleList.length})</div>
          </div>
        </div>
        <div>
          {roleList.map(role => (
            <Rectangle
              key={role.id}
              title={role.name}
              idNo={role.idNo}
              description={role.description}
              imgArray={role.imgArray}
            />
          ))}
        </div>
      </Layout>
    );
  }
}

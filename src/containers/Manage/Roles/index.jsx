import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';

import ManageTabs from 'components/ManageTabs';
import Rectangle from 'components/Rectangle';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  roleStore: rootStore.roleStore
}))
@observer
export default class Roles extends Component {
  static async onEnter({ roleStore }) {
    await roleStore.fetchRoles();
  }

  render() {
    const { roleStore } = this.props;
    const roleList = toJS(roleStore.roles) || [];

    return (
      <div className={styles.roles}>
        <ManageTabs />
        <div className={styles.container}>
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
        </div>
      </div>
    );
  }
}

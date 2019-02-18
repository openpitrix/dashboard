import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import Layout from 'components/Layout';
import Collapse from 'components/Collapse';
import ModuleFeature from './ModuleFeatures';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  roleStore: rootStore.roleStore
}))
@observer
export default class TeamRole extends Component {
  async componentDidMount() {
    const { roleStore } = this.props;

    await roleStore.fetchAll();
  }

  renderTitle({ role_name, description }) {
    return (
      <div>
        <h3 className={styles.title}>{role_name}</h3>
        <div className={styles.describtion}>{description}</div>
      </div>
    );
  }

  onChange = (role, isCheck) => {
    if (!isCheck) return null;

    const { roleStore } = this.props;
    roleStore.fetchRoleModuleName(role.role_id);
  };

  render() {
    const { roleStore } = this.props;
    const { roles } = roleStore;
    return (
      <Layout
        className={styles.container}
        isCenterPage
        centerWidth={772}
        pageTitle="Role"
      >
        {roles.map(role => (
          <Collapse
            key={role.role_id}
            className={styles.roleContainer}
            header={this.renderTitle(role)}
            onChange={isCheck => this.onChange(role, isCheck)}
            iconPosition="right"
          >
            <ModuleFeature roleId={role.role_id} roleStore={roleStore} />
          </Collapse>
        ))}
      </Layout>
    );
  }
}

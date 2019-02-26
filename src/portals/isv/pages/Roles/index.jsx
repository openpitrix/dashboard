import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import Layout from 'components/Layout';
import Collapse from 'components/Collapse';
import { getRoleName } from 'utils';
import ModuleFeature from './ModuleFeatures';
import Modals from './Modals';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  roleStore: rootStore.roleStore,
  modalStore: rootStore.modalStore
}))
@observer
export default class TeamRole extends Component {
  async componentDidMount() {
    const { roleStore } = this.props;

    await roleStore.fetchAll({
      portal: 'isv'
    });
  }

  onChange = (role, isCheck) => {
    if (!isCheck) return null;

    const { roleStore } = this.props;
    roleStore.fetchRoleModuleName(role.role_id);
  };

  onClick = () => {
    this.props.roleStore.initIsv('isv');
    this.props.modalStore.show('renderModalCreateRole');
  };

  renderTitle(role) {
    return (
      <div>
        <h3 className={styles.title}>{getRoleName(role, 'isv')}</h3>
        <div className={styles.describtion}>{role.description}</div>
      </div>
    );
  }

  renderCreateTip() {
    const { t } = this.props;
    return (
      <div className={styles.createTip}>
        <span className={styles.tips}>{t('Tips')}</span>
        <span>{t('ISV_ROLE_CREATE_TIP')}</span>
        <span className={styles.activeText} onClick={this.onClick}>
          {t('Create a role')}
        </span>
      </div>
    );
  }

  render() {
    const { roleStore, modalStore, t } = this.props;
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
        {this.renderCreateTip()}
        <Modals t={t} modalStore={modalStore} roleStore={roleStore} />
      </Layout>
    );
  }
}

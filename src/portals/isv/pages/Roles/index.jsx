import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { Icon, Button } from 'components/Base';
import Layout from 'components/Layout';
import Collapse from 'components/Collapse';
import { getRoleName, getRoleDescription, CONTROLLER } from 'config/roles';

import ModuleFeature from './ModuleFeatures';
import Modals from './Modals';

import styles from './index.scss';

@withTranslation()
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

  handleAction = (action, item) => {
    const { roleStore } = this.props;
    if (action === 'renderModalCreateRole') {
      item.handleType = 'edit';
      roleStore.initIsv(item.role_id);
    }
    roleStore.selectedRoleKeys = [item.role_id];
    this.props.modalStore.show(action, item);
  };

  renderMenu = role => {
    const { t } = this.props;

    if (role.controller === CONTROLLER.admin) {
      return null;
    }
    return (
      <div className={styles.actions}>
        <Button
          type="delete"
          onClick={() => this.handleAction('renderModalDeleteRole', role)}
        >
          {t('Delete')}
        </Button>
        <Button
          onClick={() => this.handleAction('renderModalCreateRole', role)}
        >
          {t('Edit')}
        </Button>
      </div>
    );
  };

  renderTitle(role) {
    const { t } = this.props;
    return (
      <Fragment>
        <div className={styles.flex}>
          <h3 className={styles.title}>
            {t(getRoleName(role, 'isv'))}
            {role.controller === CONTROLLER.admin && (
              <Icon className={styles.lockIcon} type="dark" name="lock" />
            )}
          </h3>
          <div className={styles.describtion}>
            {t(getRoleDescription(role, 'isv'))}
          </div>
        </div>
        {this.renderMenu(role)}
      </Fragment>
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
      <Layout className={styles.container} isCenterPage pageTitle="Role">
        {roles.map(role => (
          <Collapse
            key={role.role_id}
            className={styles.roleContainer}
            checkCls={styles.checkedContainer}
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

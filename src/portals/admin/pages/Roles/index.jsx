import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import _ from 'lodash';

import Layout, {
  Grid, Section, Panel, Card
} from 'components/Layout';
import ModalActions from './ModalActions';
import RoleTree from './RoleTree';
import ModuleTree from './ModuleTree';
import BindingActions from './BindingActions';
import Popover from './Popover';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  userStore: rootStore.userStore,
  roleStore: rootStore.roleStore,
  modalStore: rootStore.modalStore
}))
@observer
export default class Roles extends Component {
  componentDidMount() {
    this.props.roleStore.fetchAll();
  }

  componentWillUnmount() {
    this.props.roleStore.reset();
  }

  render() {
    const { t, roleStore, modalStore } = this.props;
    const { selectedRole } = roleStore;

    return (
      <Layout>
        <h2 className={styles.header}>{t('Role')}</h2>
        <Panel className={classnames(styles.noShadow)}>
          <Grid>
            <Section size={4}>
              <RoleTree roleStore={roleStore} modalStore={modalStore} />
            </Section>

            <Section size={8}>
              <Card>
                <div className={styles.selectedRoleTitle}>
                  <span className={styles.roleTitle}>
                    {t('Role')}
                    {!_.isEmpty(selectedRole) && (
                      <span>
                        「{selectedRole.role_name}」{t('of setting')}
                      </span>
                    )}
                  </span>
                  <Popover
                    t={t}
                    roleStore={roleStore}
                    modalStore={modalStore}
                  />
                </div>
                {!_.isEmpty(selectedRole) && (
                  <div className={styles.module}>
                    <div className={styles.moduleTree}>
                      <div className={styles.moduleName}>{t('模块权限')}</div>
                      <ModuleTree t={t} roleStore={roleStore} />
                    </div>
                    <div className={styles.actions}>
                      <BindingActions t={t} roleStore={roleStore} />
                    </div>
                  </div>
                )}
              </Card>
            </Section>
          </Grid>
        </Panel>
        <ModalActions t={t} modalStore={modalStore} roleStore={roleStore} />
      </Layout>
    );
  }
}

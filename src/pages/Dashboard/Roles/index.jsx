import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import _ from 'lodash';

import Layout, {
  Grid, Section, Panel, Card
} from 'components/Layout';
import RoleTree from './RoleTree';
import ModuleTree from './ModuleTree';
import BindingActions from './BindingActions';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  userStore: rootStore.userStore,
  roleStore: rootStore.roleStore,
  pageStore: rootStore.pageStore
}))
@observer
export default class Roles extends Component {
  async componentDidMount() {
    const { roleStore } = this.props;
    await roleStore.fetchAllActions();
    await roleStore.fetchAllModules();
    await roleStore.fetchAllFeatures();
    await roleStore.fetchAll();
  }

  componenetWillUnmount() {
    this.props.roleStore.reset();
  }

  render() {
    const { t, roleStore, pageStore } = this.props;
    const { isLoading, selectedRole } = roleStore;
    return (
      <Layout isLoading={isLoading}>
        <h2 className={styles.header}>{t('Role')}</h2>
        <Panel className={classnames(styles.noShadow)}>
          <Grid>
            <Section size={4}>
              <RoleTree roleStore={roleStore} pageStore={pageStore} />
            </Section>

            <Section size={8}>
              <Card>
                <div className={styles.selectedRoleTitle}>
                  {t('Role')}
                  {!_.isEmpty(selectedRole) && (
                    <span>「{selectedRole.role_name}」的设置</span>
                  )}
                </div>
                {!_.isEmpty(selectedRole) && (
                  <div className={styles.module}>
                    <div className={styles.moduleTree}>
                      <div className={styles.moduleName}>{t('模块权限')}</div>
                      <ModuleTree roleStore={roleStore} />
                    </div>
                    <div className={styles.actions}>
                      <BindingActions roleStore={roleStore} />
                    </div>
                  </div>
                )}
              </Card>
            </Section>
          </Grid>
        </Panel>
      </Layout>
    );
  }
}

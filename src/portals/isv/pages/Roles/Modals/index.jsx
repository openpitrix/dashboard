import React, { Component } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import classnames from 'classnames';

import { Input, Select } from 'components/Base';

import { Dialog } from 'components/Layout';
import Collapse from 'components/Collapse';
import Loading from 'components/Loading';
import ActionGroup from 'portals/admin/pages/Roles/BindingActions/group';
import { isvDataLevels } from 'config/roles';

import styles from './index.scss';

@observer
export default class RoleModalActions extends Component {
  onChange = (module, isCheck) => {
    const { roleStore } = this.props;
    roleStore.changeOpenModuleMap(module.key, isCheck);
  };

  getActionKeys(idx) {
    const { selectedActionKeys } = this.props.roleStore;
    if (!selectedActionKeys.length) {
      return [];
    }

    return idx < selectedActionKeys.length ? selectedActionKeys[idx] : [];
  }

  renderEditPermission() {
    const { roleStore, t } = this.props;
    const { moduleTreeData, bindActions } = roleStore;
    if (_.isEmpty(bindActions)) {
      return null;
    }

    const modules = _.get(moduleTreeData, '[0].children', []);

    return (
      <div className={styles.fmPermission}>
        <div className={styles.label}>{t('Permission')}</div>
        <div className={styles.permissions}>
          {modules.map((m, index) => (
            <Collapse
              key={m.key}
              className={styles.roleContainer}
              header={m.title}
              onChange={isCheck => this.onChange(m, isCheck)}
              iconType="switch"
              iconPosition="right"
            >
              <div>
                <ActionGroup
                  hideHeader
                  hideDataLevel
                  t={t}
                  data={bindActions[index]}
                  index={index}
                  roleStore={roleStore}
                  keys={this.getActionKeys(index)}
                />
              </div>
            </Collapse>
          ))}
        </div>
      </div>
    );
  }

  renderModalCreateRole() {
    const { modalStore, roleStore, t } = this.props;
    const { hide, item } = modalStore;
    const {
      createISVRole, changeDataLevel, isLoading, dataLevel
    } = roleStore;
    const { handleType } = item;
    const title = handleType === 'edit' ? t('Edit info') : t('Create a role');

    return (
      <Dialog
        isOpen
        className={styles.form}
        footerCls={styles.footer}
        title={title}
        width={744}
        hideFooter={isLoading}
        onCancel={hide}
        onSubmit={createISVRole}
      >
        <Loading isLoading={isLoading}>
          <div className={styles.fmCtrl}>
            <label>{t('Name')}</label>
            <Input
              className={styles.input}
              name="role_name"
              defaultValue={item.role_name}
            />
          </div>
          <div className={styles.fmCtrl}>
            <label>{t('Backlog')}</label>
            <Input
              className={styles.input}
              name="description"
              defaultValue={item.description}
            />
          </div>
          {handleType === 'edit' && (
            <Input name="role_id" value={item.role_id} type="hidden" />
          )}
          <Input name="portal" value="isv" type="hidden" />
          {this.renderEditPermission()}
          <div className={classnames(styles.fmCtrl, styles.selectCtrl)}>
            <label>{t('Data range')}</label>
            <Select
              className={styles.select}
              value={dataLevel}
              onChange={changeDataLevel}
              name="data_level"
            >
              {isvDataLevels.map(data => (
                <Select.Option key={data} value={data}>
                  {t(`data_level_${data}`)}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Loading>
      </Dialog>
    );
  }

  render() {
    const { modalStore } = this.props;
    const { isOpen, type } = modalStore;
    if (!isOpen || !type) {
      return null;
    }

    if (typeof this[type] === 'function') {
      return this[type]();
    }

    return null;
  }
}

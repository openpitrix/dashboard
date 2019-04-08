import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import { PopoverIcon, Button } from 'components/Base';
import { withCheckAction } from 'components/Can';

import { CannotEditController } from 'config/roles';
import ACTION from 'config/action-id';

const MenuItem = withCheckAction('span');
const createEditRole = 'renderModalCreateRole';

@observer
export default class RolePopover extends Component {
  get canEdit() {
    const { roleStore } = this.props;
    const isEmpty = _.isEmpty(roleStore.selectedRoleKeys);
    return (
      !isEmpty
      && _.get(roleStore, 'selectedRole.controller') !== CannotEditController
    );
  }

  handleAction(type, e) {
    e.stopPropagation();
    e.preventDefault();
    const { modalStore, roleStore } = this.props;

    if (type === createEditRole) {
      roleStore.showEditRole();
    }
    if (type === 'setBindAction') {
      roleStore.setHandleType('setBindAction');

      return;
    }
    if (type === 'cancel') {
      roleStore.setHandleType('');

      return;
    }
    if (type === 'save') {
      roleStore.changeRoleModule();

      return;
    }

    modalStore.show(type);
  }

  renderSetBindAction() {
    const { t } = this.props;

    return (
      <Fragment>
        <Button type="primary" onClick={e => this.handleAction('save', e)}>
          {t('Save')}
        </Button>
        <Button onClick={e => this.handleAction('cancel', e)}>
          {t('Cancel')}
        </Button>
      </Fragment>
    );
  }

  renderHandleGroupNode = () => {
    const { t, roleStore } = this.props;
    const { role } = roleStore;
    if (!role) return null;

    const isSystem = role.owner === 'system';

    return (
      <div className="operate-menu">
        <MenuItem
          action={ACTION.ModifyRole}
          onClickCapture={e => this.handleAction(createEditRole, e)}
        >
          {t('Edit info')}
        </MenuItem>
        <MenuItem
          action={ACTION.ModifyRoleModule}
          onClickCapture={e => this.handleAction('setBindAction', e)}
        >
          {t('Set permission')}
        </MenuItem>
        {!isSystem && (
          <MenuItem
            action={ACTION.DeleteRole}
            onClickCapture={e => this.handleAction('renderModalDeleteRole', e)}
          >
            {t('Delete')}
          </MenuItem>
        )}
      </div>
    );
  };

  render() {
    const { roleStore } = this.props;
    const { handelType } = roleStore;
    if (!this.canEdit) {
      return null;
    }
    if (!roleStore.checkAction(ACTION.TableAdminRolePopover)) {
      return null;
    }

    if (handelType === 'setBindAction') {
      return this.renderSetBindAction();
    }

    return (
      <div>
        <PopoverIcon
          portal
          size="Large"
          content={this.renderHandleGroupNode()}
        />
      </div>
    );
  }
}

import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import { PopoverIcon, Button } from 'components/Base';

import { CannotEditController } from 'config/roles';

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
        <span onClickCapture={e => this.handleAction(createEditRole, e)}>
          {/* <Icon name="pen" /> */}
          {t('Edit info')}
        </span>
        <span onClickCapture={e => this.handleAction('setBindAction', e)}>
          {/* <Icon name="listview" /> */}
          {t('Set permission')}
        </span>
        {!isSystem && (
          <span
            onClickCapture={e => this.handleAction('renderModalDeleteRole', e)}
          >
            {t('Delete')}
          </span>
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

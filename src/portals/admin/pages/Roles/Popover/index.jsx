import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import _ from 'lodash';

import { Popover, Icon, Button } from 'components/Base';

import styles from '../index.scss';

const createEditRole = 'renderModalCreateRole';

@observer
export default class RolePopover extends Component {
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
    const isSystem = role.owner_path === ':system';

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
    const { handelType, selectedRoleKeys } = roleStore;
    if (_.isEmpty(selectedRoleKeys)) {
      return null;
    }

    if (handelType === 'setBindAction') {
      return this.renderSetBindAction();
    }

    return (
      <div>
        <Popover
          portal
          content={this.renderHandleGroupNode()}
          className={classnames(styles.groupPopver)}
          targetCls={classnames(styles.groupPopverTarget)}
          popperCls={classnames(styles.groupPopverPopper)}
        >
          <Icon type="dark" name="more" />
        </Popover>
      </div>
    );
  }
}

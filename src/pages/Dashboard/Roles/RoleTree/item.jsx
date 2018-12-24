import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon } from 'components/Base';

import styles from './index.scss';

export default class RoleItem extends Component {
  static propTypes = {};

  static defaultProps = {};

  renderCreateBtn() {
    const { title } = this.props;
    return (
      <span className={styles.btnCreate}>
        <Icon className={styles.btnIcon} name="add" size={14} />
        {title}
      </span>
    );
  }

  render() {
    const {
      title, description, type, isGlobalAdmin, isAdmin
    } = this.props;
    if (type === 'createBtn') {
      return this.renderCreateBtn();
    }
    return (
      <span className={styles.roleItem}>
        <strong>
          {title}
          {isGlobalAdmin && (
            <Icon className={styles.lockIcon} type="dark" name="lock" />
          )}
        </strong>
        <br />
        <span>
          {description}
          {!isAdmin && (
            <span className={styles.normalPermission}>不可删除，可以编辑</span>
          )}
        </span>
      </span>
    );
  }
}

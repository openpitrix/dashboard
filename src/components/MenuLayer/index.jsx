import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Popover, Icon } from 'components/Base';

import styles from './index.scss';

// translate hoc should place before mobx
@translate()
@inject(({ rootStore }) => ({
  rootStore,
  user: rootStore.user
}))
@observer
export default class MenuLayer extends Component {
  static propTypes = {
    className: PropTypes.string
  };

  becomeDeveloper = isNormal => {
    const { rootStore } = this.props;
    rootStore.updateUser({
      changedRole: isNormal ? '' : 'user'
    });
    location.href = '/dashboard';
  };

  render() {
    const { className, user, t } = this.props;
    const { role, isNormal } = user;
    const changeWord = isNormal ? t('Back to developer') : t('Back to user');

    return (
      <ul className={classnames(styles.menuLayer, className)}>
        {role === 'developer' && (
          <li onClick={() => this.becomeDeveloper(isNormal)} className={styles.line}>
            <label>
              <Icon name="backup" type="dark" size={18} className={styles.icon} />
              {changeWord}
            </label>
          </li>
        )}
        <li>
          <Link to="/dashboard">
            <Icon name="dashboard" type="dark" size={18} className={styles.icon} />
            {t('Dashboard')}
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <Icon name="ssh" type="dark" size={18} className={styles.icon} />
            {t('Profile')}
          </Link>
        </li>
        <li>
          <Link to="/ssh_keys">
            <Icon name="dashboard" type="dark" size={18} className={styles.icon} />
            {t('SSH Keys')}
          </Link>
        </li>
        <li>
          <a href="/logout">
            <Icon name="logout" type="dark" size={18} className={styles.icon} />
            {t('Log out')}
          </a>
        </li>
      </ul>
    );
  }
}

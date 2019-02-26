import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link, withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Icon } from 'components/Base';
import { userMenus } from 'components/Layout/SideNav/navMap';
import routes, { toRoute } from 'routes';

import styles from './index.scss';

const roleToPortal = {
  dev: {
    roleIcon: 'wrench',
    icon: 'hammer',
    name: 'Develop Center',
    url: toRoute(routes.portal.apps, { portal: 'dev' })
  },
  isv: {
    roleIcon: 'shield',
    icon: 'shield',
    name: 'Provider Center',
    url: toRoute(routes.portal.apps, { portal: 'isv' })
  },
  admin: {
    roleIcon: 'enterprise',
    icon: 'dashboard',
    name: 'Manage Console',
    url: toRoute(routes.portal.apps, { portal: 'admin' })
  },
  user: {
    roleIcon: 'appcenter',
    icon: 'appcenter',
    name: 'App Center',
    url: '/'
  }
};

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  user: rootStore.user
}))
@observer
export class MenuLayer extends Component {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { user, className, t } = this.props;
    const { isNormal, isUserPortal } = user;
    const portal = isUserPortal
      ? roleToPortal[user.portal] || {}
      : roleToPortal.user;
    const roleIcon = (roleToPortal[user.portal] || {}).roleIcon || 'enterprise';

    return (
      <ul className={classnames(styles.menuLayer, className)}>
        <li>
          <span className={styles.userIcon}>
            <Icon
              name="human"
              size={20}
              type="dark"
              className={styles.iconImg}
            />
          </span>
          {user.username}
          {!isNormal && (
            <span
              className={classnames(styles.devIconOuter, [styles[user.protal]])}
            >
              <Icon
                name={roleIcon}
                type="white"
                size={8}
                className={styles.devIcon}
              />
            </span>
          )}
        </li>

        {!isNormal && (
          <li className={styles.dev}>
            <Icon
              name={portal.icon}
              type="dark"
              size={16}
              className={styles.iconImg}
            />
            <Link to={portal.url}>{t(portal.name)}</Link>
          </li>
        )}

        {userMenus(this.props.user.defaultPortal).map((item, idx) => {
          if (Array.isArray(item.only) && !item.only.includes(user.role)) {
            return null;
          }

          if (isUserPortal && item.userPortalShow && user.role !== 'user') {
            return null;
          }

          return (
            <li
              key={idx}
              className={classnames({
                [styles.divider]: Boolean(item.divider),
                [styles.disabled]: Boolean(item.disabled)
              })}
            >
              <Icon
                name={item.iconName}
                type="dark"
                size={16}
                className={styles.iconImg}
              />
              <Link to={item.link}>{t(item.name)}</Link>
            </li>
          );
        })}

        <li className={styles.divider}>
          <Icon name="previous" type="dark" className={styles.iconImg} />
          <a href="/logout">{t('Log out')}</a>
        </li>
      </ul>
    );
  }
}

export default withRouter(MenuLayer);

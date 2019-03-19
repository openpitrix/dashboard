import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import { Icon } from 'components/Base';
import { userMenus } from 'components/Layout/SideNav/navMap';
import routes, { toRoute } from 'routes';
import { PORTAL_NAME } from 'config/roles';

import styles from './index.scss';

const portalData = {
  [PORTAL_NAME.dev]: {
    roleIcon: 'wrench',
    icon: 'hammer',
    name: 'Develop Center',
    url: toRoute(routes.portal.apps, { portal: 'dev' })
  },
  [PORTAL_NAME.isv]: {
    roleIcon: 'shield',
    icon: 'shield',
    name: 'Provider Center',
    url: toRoute(routes.portal.apps, { portal: 'isv' })
  },
  [PORTAL_NAME.admin]: {
    roleIcon: 'enterprise',
    icon: 'dashboard',
    name: 'Manage backstage',
    url: toRoute(routes.portal.apps, { portal: 'admin' })
  },
  [PORTAL_NAME.user]: {
    roleIcon: 'appcenter',
    icon: 'appcenter',
    name: 'App Center',
    url: '/'
  }
};

@withTranslation()
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
      ? portalData[user.portal] || {}
      : portalData.user;
    const roleIcon = (portalData[user.portal] || {}).roleIcon || 'enterprise';

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
          <span className={styles.username}>{user.username}</span>
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
            <Link to={portal.url}>
              <Icon
                name={portal.icon}
                type="dark"
                size={16}
                className={styles.icon}
              />
              <span className={styles.label}>{t(portal.name)}</span>
            </Link>
          </li>
        )}

        {userMenus(this.props.user.defaultPortal).map((item, idx) => {
          if (Array.isArray(item.only) && !item.only.includes(user.portal)) {
            return null;
          }

          if (
            isUserPortal
            && item.userPortalShow
            && user.portal !== PORTAL_NAME.user
          ) {
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
              <NavLink to={item.link} exact activeClassName={styles.active}>
                <Icon
                  name={item.iconName}
                  type="dark"
                  size={16}
                  className={styles.icon}
                />
                <span className={styles.label}>{t(item.name)}</span>
              </NavLink>
            </li>
          );
        })}

        <li className={styles.divider}>
          <a href="/logout">
            <Icon name="previous" type="dark" className={styles.icon} />
            <span>{t('Log out')}</span>
          </a>
        </li>
      </ul>
    );
  }
}

export default withRouter(MenuLayer);

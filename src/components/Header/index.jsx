import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import { Popover, Icon } from 'components/Base';
import MenuLayer from 'components/MenuLayer';
import routes, { toRoute } from 'routes';

import styles from './index.scss';

const LinkItem = ({ to, title, path }) => {
  const isActive = to === '/' ? ['/', '/apps/:appId'].includes(path) : path.startsWith(to);

  return (
    <NavLink
      to={to}
      exact
      className={classnames({ [styles.active]: isActive })}
    >
      {title}
    </NavLink>
  );
};

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  user: rootStore.user
}))
@observer
export class Header extends Component {
  renderMenus = () => {
    const { t, user, match } = this.props;
    const { path } = match;

    if (!user.isLoggedIn()) {
      return null;
    }

    return (
      <div className={styles.menus}>
        <LinkItem to="/" title={t('App Store')} path={path} />
        <LinkItem
          to={toRoute(routes.portal.apps)}
          title={t('Purchased')}
          path={path}
        />
        <LinkItem
          to={toRoute(routes.portal.clusters)}
          title={t('My Instances')}
          path={path}
        />
        <LinkItem
          to={toRoute(routes.portal.runtimes)}
          title={t('My Runtimes')}
          path={path}
        />
      </div>
    );
  };

  renderMenuBtns() {
    const { t, user } = this.props;

    if (!user.isLoggedIn()) {
      return (
        <NavLink to="/login" className={styles.login}>
          {t('Sign In')}
        </NavLink>
      );
    }

    return (
      <div className={styles.user}>
        <Popover content={<MenuLayer />}>
          {user.username}
          <Icon
            name="caret-down"
            className={styles.icon}
            type="dark"
            size={12}
          />
        </Popover>
      </div>
    );
  }

  render() {
    const { t, user } = this.props;

    return (
      <div className={classnames('header', styles.header, styles.menusHeader)}>
        <div className={styles.wrapper}>
          <Link to="/">
            <label className={styles.logoIcon}>
              <img src="/op-logo.svg" className={styles.logo} />
              {/* <Icon className={styles.icon} name="op-logo" size={16} /> */}
            </label>
            {!user.isLoggedIn() && (
              <label className={styles.logoName}>
                {t('QingCloud App Center')}
              </label>
            )}
          </Link>

          {this.renderMenus()}
          {this.renderMenuBtns()}

          {(user.isNormal || !user.isLoggedIn()) && (
            <Fragment>
              {/*  <Icon
                name="mail"
                size={20}
                type="white"
                className={styles.mail}
              /> */}
              <Link
                to={toRoute(routes.portal._user.providerApply, 'user')}
                className={styles.upgrade}
              >
                <Icon
                  name="shield"
                  size={16}
                  type="white"
                  className={styles.shield}
                />
                {t('UPGRADE_PROVIDER')}
              </Link>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Header);

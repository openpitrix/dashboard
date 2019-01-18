import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink, withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Popover, Icon } from 'components/Base';
import MenuLayer from 'components/MenuLayer';
import { toUrl } from 'utils/url';
import { pathWithHeader } from 'routes';

import styles from './index.scss';

const LinkItem = ({ to, title }) => (
  <NavLink to={to} exact activeClassName={styles.active}>
    {title}
  </NavLink>
);

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  user: rootStore.user
}))
@observer
export class Header extends Component {
  static propTypes = {
    isHome: PropTypes.bool
  };

  renderMenus = () => {
    const { t, user } = this.props;

    if (!user.isLoggedIn()) {
      return null;
    }

    return (
      <div className={styles.menus}>
        <LinkItem to="/" title={t('App Store')} />
        <LinkItem to={toUrl('/:dash/purchased')} title={t('Purchased')} />
        <LinkItem to={toUrl('/:dash/clusters')} title={t('My Instances')} />
        <LinkItem to={toUrl('/:dash/runtimes')} title={t('My Runtimes')} />
      </div>
    );
  };

  renderMenuBtns() {
    const { t } = this.props;
    const { username } = this.props.user;

    if (!username) {
      return (
        <NavLink to="/login" className={styles.login}>
          {t('Sign In')}
        </NavLink>
      );
    }

    return (
      <div className={styles.user}>
        <Popover content={<MenuLayer />}>
          {username}
          <Icon name="caret-down" className={styles.icon} type="dark" />
        </Popover>
      </div>
    );
  }

  render() {
    const { t, user } = this.props;

    return (
      <div className={classnames('header', styles.header, styles.menusHeader)}>
        <div className={styles.wrapper}>
          {user.user_id ? (
            <Link className={styles.logoIcon} to="/">
              <Icon
                className={styles.icon}
                name="op-logo"
                type="white"
                size={16}
              />
            </Link>
          ) : (
            <NavLink className={styles.logo} to="/">
              <img src="/logo_light.svg" height="100%" />
            </NavLink>
          )}

          {this.renderMenus()}
          {this.renderMenuBtns()}

          {user.user_id && (
            <Fragment>
              <Icon
                name="mail"
                size={20}
                type="white"
                className={styles.mail}
              />
              <Link to="/dashboard/provider/submit" className={styles.upgrade}>
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

import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import { Popover, Icon, Button } from 'components/Base';
import MenuLayer from 'components/MenuLayer';
import routes, { toRoute } from 'routes';
import MenuIntroduction from 'components/MenuIntroduction';
import { getCookie, setCookie } from 'utils';
import menus from './menus';

import styles from './index.scss';

const LinkItem = ({
  to, title, path, isIntroduction
}) => {
  const isActive = to === '/' ? ['/', '/apps/:appId'].includes(path) : path.startsWith(to);
  return (
    <NavLink
      to={to}
      exact
      className={classnames({
        [styles.active]: isActive,
        [styles.introduction]: isIntroduction
      })}
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
  state = {
    activeIndex: 0
  };

  changeIntroduction = isKnow => {
    const index = this.state.activeIndex;
    this.setState({
      activeIndex: this.state.activeIndex + 1
    });
    if (index >= menus.length || isKnow) {
      const { user } = this.props;
      setCookie(`${user.user_id}_no_introduction`, true);
    }
  };

  rederStartModal() {
    const { t } = this.props;

    return (
      <div>
        <div className={styles.startModal}>
          <div className={styles.banner}>
            <Icon
              onClick={() => this.changeIntroduction(true)}
              className={styles.close}
              name="close"
              size={36}
              type="white"
            />
          </div>
          <div className={styles.word}>
            <div className={styles.title}>{t('WELCOME_TO_OPENPITRIX')}</div>
            <div className={styles.description}>
              {t('WELCOME_TO_OPENPITRIX_DESC')}
            </div>
            <Button
              onClick={() => this.changeIntroduction()}
              type="primary"
              className={styles.startButton}
            >
              {t("Let's start")}
            </Button>
          </div>
        </div>
        <div className={styles.modalShadow} />
      </div>
    );
  }

  renderMenus() {
    const { t, user, match } = this.props;
    const { path } = match;
    const { activeIndex } = this.state;
    const introduction = (menus[activeIndex - 1] || {}).introduction;
    const len = menus.length;
    const noIntroduction = getCookie(`${user.user_id}_no_introduction`);

    if (!user.isLoggedIn()) {
      return null;
    }

    return (
      <div className={styles.menus}>
        {menus.map((item, index) => (
          <LinkItem
            key={item.name}
            to={toRoute(routes.portal[item.link])}
            title={t(item.name)}
            path={path}
            index={index}
            isIntroduction={index === activeIndex - 1}
            changeIntroduction={this.changeIntroduction}
          />
        ))}

        {!noIntroduction && activeIndex === 0 && this.rederStartModal()}

        {!noIntroduction && activeIndex > 0 && (
          <MenuIntroduction
            title={t(introduction.title)}
            description={t(introduction.description)}
            image={introduction.image}
            total={len}
            changeIntroduction={this.changeIntroduction}
            activeIndex={activeIndex}
          />
        )}
      </div>
    );
  }

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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link, withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Icon } from 'components/Base';
import { userMenus } from 'components/Layout/SideNav/navMap';
import { toUrl } from 'utils/url';

import styles from './index.scss';

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

  becomeDeveloper = isNormal => {
    this.props.user.update({
      changedRole: isNormal ? '' : 'user'
    });
    location.replace('/dashboard');
  };

  render() {
    const { user, className, t } = this.props;
    const { isNormal } = user;
    const changeWord = isNormal ? t('Develop Center') : t('App Center');
    const isDeveloper = user.role === 'developer';

    return (
      <ul className={classnames(styles.menuLayer, className)}>
        <li>
          <span className={styles.userIcon}>
            <Icon
              name="human"
              size={32}
              type="dark"
              className={styles.iconImg}
            />
          </span>
          {user.username}
          {isDeveloper && (
            <span className={styles.devIconOuter}>
              <Icon
                name="wrench"
                type="white"
                size={8}
                className={styles.devIcon}
              />
            </span>
          )}
        </li>

        {isDeveloper && (
          <li
            className={styles.dev}
            onClick={() => this.becomeDeveloper(isNormal)}
          >
            <Icon
              name={isNormal ? 'wrench' : 'appcenter'}
              type="dark"
              size={16}
              className={styles.iconImg}
            />
            <label>{changeWord}</label>
          </li>
        )}

        {userMenus.map((item, idx) => {
          if (Array.isArray(item.only) && !item.only.includes(user.role)) {
            return null;
          }
          if (typeof item.only === 'string' && user.role !== item.only) {
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
              <Link to={toUrl(item.link)}>{t(item.name)}</Link>
            </li>
          );
        })}

        <li>
          <Icon name="previous" type="dark" className={styles.iconImg} />
          <a href="/logout">{t('Log out')}</a>
        </li>
      </ul>
    );
  }
}
export default withRouter(MenuLayer);

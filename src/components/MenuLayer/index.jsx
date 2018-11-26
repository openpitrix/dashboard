import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link, withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Icon } from 'components/Base';

import { userMeuns } from 'components/Layout/SideNav/navMap';
import styles from './index.scss';

// translate hoc should place before mobx
@translate()
@inject(({ rootStore }) => ({
  rootStore,
  user: rootStore.user
}))
@observer
class MenuLayer extends Component {
  static propTypes = {
    className: PropTypes.string
  };

  becomeDeveloper = isNormal => {
    const { rootStore, history } = this.props;
    rootStore.updateUser({
      changedRole: isNormal ? '' : 'user'
    });
    history.push('/dashboard');
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

        {userMeuns.map(item => (
          <li key={item.name}>
            <Icon
              name={item.iconName}
              type="dark"
              size={16}
              className={styles.iconImg}
            />
            {item.name === 'Log out' && <a href={item.link}>{t(item.name)}</a>}
            {item.name !== 'Log out' && (
              <Link to={item.link}>{t(item.name)}</Link>
            )}
          </li>
        ))}
      </ul>
    );
  }
}
export default withRouter(MenuLayer);

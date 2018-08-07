import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Icon } from 'components/Base';
import { getLoginDate } from 'src/utils';

import styles from './index.scss';

@translate()
export default class UserInfo extends PureComponent {
  static propTypes = {
    userImg: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.string,
    loginInfo: PropTypes.string
  };

  render() {
    const { name, role, loginInfo, t, i18n } = this.props;
    const lng = i18n.language || 'en';

    return (
      <div className={styles.userInfo}>
        <div>
          <div className={styles.userImg}>
            <Icon name="human" type={'light'} size={24} />
          </div>
          <div className={styles.user}>
            <div className={styles.name}>{t('greet words', { name })}</div>
            <div className={styles.role}>{t('role', { context: role })}</div>
          </div>
        </div>
        <div className={styles.loginInfo}>
          {t('last login time', { last_login: getLoginDate(loginInfo, lng) })}
        </div>
      </div>
    );
  }
}

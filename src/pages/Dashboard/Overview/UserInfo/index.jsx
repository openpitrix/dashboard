import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { Icon } from 'components/Base';
import { getLoginDate } from 'utils';

import styles from './index.scss';

@withTranslation()
export default class UserInfo extends PureComponent {
  static propTypes = {
    loginInfo: PropTypes.number,
    role: PropTypes.string,
    username: PropTypes.string
  };

  render() {
    const {
      username, role, loginInfo, t, i18n
    } = this.props;
    const lng = i18n.language || 'zh';
    const roleMap = {
      user: 'Normal User',
      developer: 'Developer',
      global_admin: 'Administrator'
    };

    return (
      <div className={styles.userInfo}>
        <div>
          <div className={styles.userImg}>
            <Icon name="human" type={'light'} size={24} />
          </div>
          <div className={styles.user}>
            <div className={styles.name}>
              {t('greet words', { name: t(username) })}
            </div>
            <div className={styles.role}>{t(roleMap[role])}</div>
          </div>
        </div>
        <div className={styles.loginInfo}>
          {t('last login time', { last_login: getLoginDate(loginInfo, lng) })}
        </div>
      </div>
    );
  }
}

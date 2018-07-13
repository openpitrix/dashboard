import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import trans, { __ } from 'hoc/trans';

import styles from './index.scss';

@trans()
export default class UserInfo extends PureComponent {
  static propTypes = {
    userImg: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.string,
    loginInfo: PropTypes.string
  };

  render() {
    const { userImg, name, role, loginInfo } = this.props;

    return (
      <div className={styles.userInfo}>
        <div>
          <img className={styles.userImg} src={userImg} />
          <div className={styles.user}>
            <div className={styles.name}>{__('greet words', { name })}</div>
            <div className={styles.role}>{__('role', { context: role })}</div>
          </div>
        </div>
        <div className={styles.loginInfo}>{__('last login time', { last_login: loginInfo })}</div>
      </div>
    );
  }
}

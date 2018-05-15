import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

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
            <div className={styles.name}>Hi,{name}</div>
            <div className={styles.role}>{role}</div>
          </div>
        </div>
        <div className={styles.loginInfo}>Last Logged in {loginInfo}</div>
      </div>
    );
  }
}

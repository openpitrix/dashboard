import React, { PureComponent } from 'react';

import styles from './index.scss';

export default class Footer extends PureComponent {
  render() {
    return (
      <div className={styles.footer}>
        <div className={styles.wrapper}>
          <span className={styles.logo}>
            <img src="/assets/logo_grey.svg" alt="logo" height="100%" />
          </span>
          <ul className={styles.terms}>
            <li>
              <a href="javascript:;">About</a>
            </li>
            <li>
              <a href="javascript:;">Help</a>
            </li>
            <li>
              <a href="javascript:;">Terms</a>
            </li>
            <li className={styles.copyright}>OpenPitrix &copy; 2018</li>
          </ul>
        </div>
      </div>
    );
  }
}

import React, { PureComponent } from 'react';

import Search from '../Base/Search';
import styles from './index.scss';

export default class Footer extends PureComponent {
  render() {
    return (
      <div className={styles.banner}>
        <div className={styles.wrapper}>
          <div className={styles.title}>
            Application Management Platform on Multi-Cloud Environment.
          </div>
          <Search className={styles.search} placeholder="Search apps in Pitrix"/>
        </div>
      </div>
    );
  }
}

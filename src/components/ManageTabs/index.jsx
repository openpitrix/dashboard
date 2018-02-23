import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './index.scss';

export default class ManageTabs extends PureComponent {
  render() {
    return (
      <div className={styles.tabs}>
        <ul className={styles.tabsList}>
          <li><NavLink to="/manage/apps" activeClassName={styles.active}>Apps</NavLink></li>
          <li><NavLink to="/manage/clusters" activeClassName={styles.active}>Clusters</NavLink></li>
        </ul>
      </div>
    );
  }
}

import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './index.scss';

export default class ManageTabs extends PureComponent {
  render() {
    return (
      <div className={styles.tabs}>
        <ul className={styles.tabsList}>
          <li>
            <NavLink to="/manage/overview" activeClassName={styles.active}>
              Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/manage/apps" activeClassName={styles.active}>
              Apps
            </NavLink>
          </li>
          <li>
            <NavLink to="/manage/clusters" activeClassName={styles.active}>
              Clusters
            </NavLink>
          </li>
          <li>
            <NavLink to="/manage/runtimes" activeClassName={styles.active}>
              Runtimes
            </NavLink>
          </li>
          <li>
            <NavLink to="/manage/repos" activeClassName={styles.active}>
              Repos
            </NavLink>
          </li>
          <li>
            <NavLink to="/manage/users" activeClassName={styles.active}>
              Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/manage/roles" activeClassName={styles.active}>
              Roles
            </NavLink>
          </li>
          <li>
            <NavLink to="/manage/categories" activeClassName={styles.active}>
              Categories
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }
}

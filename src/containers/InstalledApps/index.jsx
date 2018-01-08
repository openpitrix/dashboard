import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import ManageTabs from 'components/ManageTabs';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import styles from './index.scss';

@inject('rootStore')
@observer
export default class InstalledApps extends Component {
  render() {
    return (
      <div className={styles.apps}>
        <ManageTabs />

        <div className={styles.container}>
          <div className={styles.toolbar}>
            <Button className={styles.dropdown}>All types</Button>
            <Input.Search className={styles.search} placeholder="Search App Name"/>
          </div>

          <ul className={styles.list}>
            <li className={styles.listItem}>
              <img className={styles.icon} src="http://via.placeholder.com/96x96" />
              <div className={styles.name}><a href="#">HarshData</a></div>
              <div className={styles.handle}>
                <Button type="primary">Deploy</Button>
                <Button>...</Button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { Link } from 'react-router-dom';
import ManageTabs from 'components/ManageTabs';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Select from 'components/Base/Select';
import styles from './index.scss';

@inject('rootStore')
@observer
export default class InstalledApps extends Component {
  static async onEnter({ appStore }) {
    await appStore.fetchInstalledApps();
  }

  render() {
    const { appStore } = this.props.rootStore;

    return (
      <div className={styles.apps}>
        <ManageTabs />

        <div className={styles.container}>
          <div className={styles.toolbar}>
            <Select className={styles.select} value="All Types">
              <Select.Option value="1">Types1</Select.Option>
              <Select.Option value="2">Types2</Select.Option>
            </Select>
            <Input.Search className={styles.search} placeholder="Search App Name"/>
          </div>

          <ul className={styles.list}>
            {
              appStore.installedApps && appStore.installedApps.map(item =>
                <li key={item.id} className={styles.listItem}>
                  <img className={styles.icon} src={item.icon || 'http://via.placeholder.com/96x96'}/>
                  <div className={styles.name}>
                    <Link to={`/app/${item.id}`}>{item.name}</Link>
                  </div>
                  <div className={styles.handle}>
                    <Link to={`/app/${item.id}/deploy`}>
                      <Button type="primary">Deploy</Button>
                    </Link>
                    <Button>...</Button>
                  </div>
                </li>,
              )
            }
          </ul>
        </div>
      </div>
    );
  }
}

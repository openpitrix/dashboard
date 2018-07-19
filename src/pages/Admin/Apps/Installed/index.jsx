import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { Link } from 'react-router-dom';
import Icon from 'components/Base/Icon';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Select from 'components/Base/Select';
import Popover from 'components/Base/Popover';
import Layout from 'components/Layout';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  appStore: rootStore.appStore
}))
@observer
export default class InstalledApps extends Component {
  static async onEnter({ appStore }) {
    await appStore.fetchInstalledApps();
  }

  renderHandleMenu = id => (
    <div id={id} className="operate-menu">
      <span>View app cluster</span>
      <span>Delete app</span>
    </div>
  );

  render() {
    const { appStore } = this.props;

    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.toolbar}>
              <Select className={styles.select} value="All Types">
                <Select.Option value="1">Types1</Select.Option>
                <Select.Option value="2">Types2</Select.Option>
              </Select>
              <Input.Search className={styles.search} placeholder="Search App Name" />
            </div>

            <ul className={styles.list}>
              {appStore.installedApps &&
                appStore.installedApps.map(item => (
                  <li key={item.id} className={styles.listItem}>
                    <img className={styles.icon} src={item.icon} />
                    <div className={styles.name}>
                      <Link to={`/app/${item.id}`}>{item.name}</Link>
                    </div>
                    <div className={styles.handle}>
                      <Link to={`/app/${item.id}/deploy`}>
                        <Button type="primary">Deploy</Button>
                      </Link>
                      <Popover
                        className={styles.handlePop}
                        content={this.renderHandleMenu(item.id)}
                      >
                        <Button>
                          <Icon name="more" />
                        </Button>
                      </Popover>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Layout>
    );
  }
}

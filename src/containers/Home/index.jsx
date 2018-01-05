import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import Nav from 'components/Nav';
import AppList from 'components/AppList';
import styles from './index.scss';

@inject('rootStore')
@observer
export default class Home extends Component {
  static async onEnter({ appStore }) {
    await appStore.fetchApps();
  }

  render() {
    const { config, appStore } = this.props.rootStore;

    return (
      <div className={styles.home}>
        <Nav className={styles.nav} navs={config.navs}/>
        <AppList className={styles.apps} apps={appStore.apps}/>
      </div>
    );
  }
}

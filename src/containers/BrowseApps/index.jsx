import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import Nav from 'components/Nav';
import styles from './index.scss';

@inject('rootStore')
@observer
export default class BrowseApps extends Component {
  render() {
    const { config } = this.props.rootStore;

    return (
      <div className={styles.browse}>
        <Nav navs={config.navs}/>
        {/* <AppList /> */}
      </div>
    );
  }
}

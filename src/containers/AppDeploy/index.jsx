import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';

import styles from './index.scss';

@inject('rootStore')
@observer
export default class AppDetail extends Component {
  static async onEnter({ appStore }, { appId }) {
    await appStore.fetchApp(appId);
  }

  render() {
    const { appStore } = this.props.rootStore;

    return (
      <div className={styles.deploy}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <Link to={`/app/${appStore.app.id}`}><i className="fa fa-long-arrow-left"/> 返回到目录</Link>
          </div>
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import Layout, { BackBtn, CreateResource } from 'components/Layout/Admin';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  deployStore: rootStore.appDeployStore
}))
@observer
export default class AppDeploy extends Component {
  static async onEnter({ appStore }, params) {
    await appStore.fetch(params.appId);
  }

  render() {
    const { appStore, deployStore } = this.props;
    const { notifyMsg, hideMsg } = appStore;
    const title = 'Deplo app';

    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg}>
        <BackBtn label="clusters" link="/dashboard/clusters" />
        <CreateResource title={title} aside={this.renderAside()} className={styles.deploy}>
          {this.renderForm()}
        </CreateResource>
      </Layout>
    );

    // return (
    //   <div className={styles.deploy}>
    //     <div className={styles.wrapper}>
    //       <div className={styles.header}>
    //         <Link to={`/app/${app_id}`}>
    //           <i className="fa fa-long-arrow-left" /> 返回到App详情
    //         </Link>
    //       </div>
    //     </div>
    //   </div>
    // );
  }

  renderAside() {
    return null;
  }

  renderForm() {
    return null;
  }
}

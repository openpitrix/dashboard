import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';

import UserInfo from 'components/UserInfo';
import TotalCard from 'components/UserInfo/TotalCard';
import Panel from './Panel';
import AppList from './AppList';
import ClusterList from './ClusterList';
import RepoList from './RepoList';
import Layout from 'components/Layout/Admin';
import { imgPlaceholder, getSessInfo, getLoginDate } from 'src/utils';
import trans, { __ } from 'hoc/trans';

import styles from './index.scss';

@trans()
@inject(({ rootStore, sessInfo }) => ({
  appStore: rootStore.appStore,
  clusterStore: rootStore.clusterStore,
  repoStore: rootStore.repoStore,
  categoryStore: rootStore.categoryStore,
  userStore: rootStore.userStore,
  runtimeStore: rootStore.runtimeStore,
  sessInfo
}))
@observer
export default class Overview extends React.Component {
  static async onEnter({
    appStore,
    clusterStore,
    repoStore,
    categoryStore,
    userStore,
    runtimeStore
  }) {
    await appStore.fetchAll({ noLimit: true });
    await clusterStore.fetchAll();
    await repoStore.fetchAll();
    await categoryStore.fetchAll();
    await userStore.fetchAll();
    await runtimeStore.fetchAll();
  }

  handleClickTotalCard = label => {
    this.props.history.push(`/dashboard/${label.toLowerCase()}`);
  };

  adminOverview = () => {
    const { appStore, clusterStore, repoStore, categoryStore, userStore, sessInfo } = this.props;
    const countLimit = 5;

    const appList = appStore.apps.slice(0, countLimit);
    const clusterList = clusterStore.clusters.slice(0, countLimit);
    const repoList = repoStore.getRepoApps(repoStore.repos, appStore.apps);

    const userInfo = {
      userImg: imgPlaceholder(36),
      name: getSessInfo('user', sessInfo),
      role: getSessInfo('role', sessInfo),
      loginInfo: getLoginDate(getSessInfo('last_login', sessInfo))
    };

    const summary = {
      Apps: appStore.totalCount,
      Clusters: clusterStore.totalCount,
      Categories: categoryStore.categories.length,
      Users: userStore.totalCount
    };

    return (
      <Layout>
        <section>
          <UserInfo {...userInfo} />
          {Object.keys(summary).map(label => (
            <TotalCard
              name={label}
              total={summary[label]}
              key={label}
              onClick={this.handleClickTotalCard.bind(this, label)}
            />
          ))}
        </section>

        <section className={styles.listOuter}>
          <Panel title={__('Top Repos')} linkTo="/dashboard/repos" isAdmin>
            <RepoList repos={repoList} type="public" />
            <RepoList repos={repoList} type="private" limit={2} />
          </Panel>

          <Panel title={__('Top Apps')} linkTo="/dashboard/apps" isAdmin>
            <AppList apps={appList} />
          </Panel>

          <Panel title={__('Latest Clusters')} linkTo="/dashboard/clusters" isAdmin>
            <ClusterList clusters={clusterList} />
          </Panel>
        </section>
      </Layout>
    );
  };

  normalOverview = () => {
    const { sessInfo, appStore, runtimeStore, clusterStore } = this.props;
    const countLimit = 3;

    const name = getSessInfo('user', sessInfo);
    const appList = appStore.apps.slice(0, countLimit);
    const runtimeList = runtimeStore.runtimes.slice(0, countLimit);
    const clusterList = clusterStore.clusters.slice(0, countLimit);

    return (
      <Layout>
        <section className={styles.userInfo}>
          <div className={styles.userName}>{__('greet words', { name })}</div>
          <div className={styles.hello}>Welcome to OpenPitirx, What would you like to do?</div>
        </section>

        <section className={styles.listOuter}>
          <Panel
            title={__('Recently Viewed Apps')}
            linkTo="/apps"
            btnName="Browse"
            len={appList.length}
          >
            <AppList apps={appList} />
          </Panel>

          <Panel
            title={__('My Runtimes')}
            linkTo="/dashboard/runtime/create"
            btnName="Create"
            len={runtimeList.length}
          >
            <RepoList repos={runtimeList} type="runtime" />
          </Panel>

          <Panel
            title={__('Latest Clusters')}
            linkTo="/dashboard/clusters"
            btnName="Manage"
            len={clusterList.length}
          >
            <ClusterList clusters={clusterList} />
          </Panel>
        </section>
      </Layout>
    );
  };

  render() {
    const role = getSessInfo('role', this.props.sessInfo);
    return role === 'admin' ? this.adminOverview() : this.normalOverview();
  }
}

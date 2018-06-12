import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';

import UserInfo from 'components/UserInfo';
import TotalCard from 'components/UserInfo/TotalCard';
import AppList from './AppList';
import ClusterList from './ClusterList';
import RepoList from './RepoList';
import Layout from 'pages/Layout/Admin';
import { getParseDate, getCookie, getLoginDate } from 'utils';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  clusterStore: rootStore.clusterStore,
  repoStore: rootStore.repoStore,
  categoryStore: rootStore.categoryStore,
  userStore: rootStore.userStore
}))
@observer
export default class Overview extends Component {
  static async onEnter({ appStore, clusterStore, repoStore, categoryStore, userStore }) {
    await appStore.fetchApps();
    await clusterStore.fetchClusters();
    await repoStore.fetchRepos();
    await categoryStore.fetchCategories();
    await userStore.fetchUsers();
  }

  render() {
    const { userImg, name, role, loginInfo } = {
      userImg: 'http://via.placeholder.com/36x36',
      name: getCookie('user'),
      role: getCookie('role'),
      loginInfo: getLoginDate(getCookie('last_login'))
    };
    const { appStore, clusterStore, repoStore, categoryStore, userStore } = this.props;
    const appList = appStore.apps.slice(0, 5);
    const clusterList = clusterStore.clusters.slice(0, 5);
    const repoList = repoStore.repos;

    let reposPublic = [],
      reposPrivate = [];
    for (let i = 0; i < repoList.length; i++) {
      if (repoList[i].visibility === 'public') {
        reposPublic.push(repoList[i]);
      } else {
        reposPrivate.push(repoList[i]);
      }
    }
    const publicLen = reposPrivate.length > 2 ? 3 : 5 - reposPrivate.length;
    const privateLen = reposPublic.length > 2 ? 3 : 5 - reposPublic.length;

    const totalArray = [
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'apps',
        total: appStore.totalCount
      },
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'Clusters',
        total: clusterStore.totalCount
      },
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'Categories',
        total: categoryStore.categories.length
      },
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'Users',
        total: userStore.totalCount
      }
    ];

    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.total}>
            <UserInfo userImg={userImg} name={name} role={role} loginInfo={loginInfo} />
            {totalArray.map((data, index) => (
              <TotalCard key={index} icon={data.icon} name={data.name} total={data.total} />
            ))}
          </div>

          <div className={styles.listOuter}>
            <div className={styles.cardList}>
              <div className={styles.title}>
                Top Repos
                <Link className={styles.more} to={'/dashboard/repos'}>
                  more...
                </Link>
              </div>
              {reposPublic.length > 0 && <div className={styles.type}>Public</div>}
              <RepoList repos={reposPublic.slice(0, publicLen)} type={`Public`} />
              {reposPrivate.length > 0 && <div className={styles.type}>Private</div>}
              <RepoList repos={reposPrivate.splice(0, privateLen)} type={`Private`} />
            </div>
            <div className={styles.cardList}>
              <div className={styles.title}>
                Top Apps
                <Link className={styles.more} to={'/dashboard/apps'}>
                  more...
                </Link>
              </div>
              <AppList apps={appList} />
            </div>
            <div className={styles.cardList}>
              <div className={styles.title}>
                Latest Clusters
                <Link className={styles.more} to={'/dashboard/clusters'}>
                  more...
                </Link>
              </div>
              <ClusterList clusters={clusterList} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

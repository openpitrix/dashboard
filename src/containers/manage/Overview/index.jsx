import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';

import ManageTabs from 'components/ManageTabs';
import UserInfo from 'components/UserInfo';
import TotalCard from 'components/UserInfo/TotalCard';
import AppList from './AppList';
import ClusterList from './ClusterList';
import RepoList from './RepoList';
import styles from './index.scss';
import CategoryStore from '../../../stores/CategoryStore';

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
    await appStore.fetchAll({ page: 1 });
    await clusterStore.fetchClusters({ page: 1 });
    await repoStore.fetchRepos();
    await categoryStore.fetchCategories();
    await userStore.fetchUsers({ page: 1 });
  }

  render() {
    const { userImg, name, role, loginInfo } = {
      userImg: 'http://via.placeholder.com/36x36',
      name: 'Wayne',
      role: 'Administrator',
      loginInfo: 'Dec 29 at 10:17am'
    };
    const { appStore, clusterStore, repoStore, categoryStore, userStore } = this.props;
    const appList = appStore.apps.slice(0, 5);
    const clusterList = clusterStore.clusters.slice(0, 5);
    const repoList = repoStore.repos;
    let reposPublic = [],
      reposPrivate = [];
    for (let i = 0; i < repoList.length; i++) {
      if (repoList[i].visibility === 'Public') {
        reposPublic.push(repoList[i]);
      } else {
        reposPrivate.push(repoList[i]);
      }
    }

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
      <div className={styles.overview}>
        <ManageTabs />

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
                <Link className={styles.more} to={'/manage/repos'}>
                  more...
                </Link>
              </div>
              <div className={styles.type}>Public</div>
              <RepoList repos={reposPublic.slice(0, 2)} type={`Public`} />
              <div className={styles.type}>Private</div>
              <RepoList repos={reposPrivate.splice(0, 3)} type={`Private`} />
            </div>
            <div className={styles.cardList}>
              <div className={styles.title}>
                Top Apps
                <Link className={styles.more} to={'/manage/apps'}>
                  more...
                </Link>
              </div>
              <AppList apps={appList} />
            </div>
            <div className={styles.cardList}>
              <div className={styles.title}>
                Latest Clusters
                <Link className={styles.more} to={'/manage/clusters'}>
                  more...
                </Link>
              </div>
              <ClusterList clusters={clusterList} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

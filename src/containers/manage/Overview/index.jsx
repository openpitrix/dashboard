import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';

import ManageTabs from 'components/ManageTabs';
import UserInfo from 'components/UserInfo';
import TotalCard from 'components/UserInfo/TotalCard';
import LiApps from 'components/LiApps';
import LiClusters from 'components/LiClusters';
import LiRepos from 'components/LiRepos';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  clusterStore: rootStore.clusterStore,
  repoStore: rootStore.repoStore
}))
@observer
export default class Overview extends Component {
  static async onEnter({ appStore, clusterStore, repoStore }) {
    await appStore.fetchAll({ page: 1 });
    await clusterStore.fetchClusters({ page: 1 });
    await repoStore.fetchRepos();
  }

  render() {
    const { userImg, name, role, loginInfo } = {
      userImg: 'http://via.placeholder.com/36x36',
      name: 'Wayne',
      role: 'Administrator',
      loginInfo: 'Dec 29 at 10:17am'
    };
    const { appStore, clusterStore, repoStore } = this.props;
    const appsArray = appStore.apps.slice(0, 5);
    const clustersArray = clusterStore.clusters.slice(0, 5);
    const reposArray = repoStore.repos;
    let reposArray1 = [],
      reposArray2 = [];
    for (let i = 0; i < reposArray.length; i++) {
      if (reposArray[i].visibility === 'Public') {
        reposArray1.push(reposArray[i]);
      } else {
        reposArray2.push(reposArray[i]);
      }
    }

    const totalArray = [
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'apps',
        total: 192
      },
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'Clusters',
        total: 342
      },
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'Categories',
        total: 7
      },
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'Users',
        total: 84
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
              <LiRepos reposData={reposArray1.slice(0, 2)} reposType={'Public'} />
              <div className={styles.type}>Private</div>
              <LiRepos reposData={reposArray2.splice(0, 3)} reposType={'Private'} />
            </div>
            <div className={styles.cardList}>
              <div className={styles.title}>
                Top Apps
                <Link className={styles.more} to={'/manage/apps'}>
                  more...
                </Link>
              </div>
              <LiApps appsData={appsArray} />
            </div>
            <div className={styles.cardList}>
              <div className={styles.title}>
                Latest Clusters
                <Link className={styles.more} to={'/manage/clusters'}>
                  more...
                </Link>
              </div>
              <LiClusters clustersData={clustersArray} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

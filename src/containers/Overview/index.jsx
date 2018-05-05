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
  overviewStore: rootStore.overviewStore
}))
@observer
export default class Overview extends Component {
  static async onEnter({ overviewStore }) {
    await overviewStore.fetchOverview();
  }

  render() {
    const { overviewStore } = this.props;
    const { userImg, name, role, loginInfo } = {
      userImg: 'http://via.placeholder.com/36x36',
      name: 'Wayne',
      role: 'Administrator',
      loginInfo: 'Dec 29 at 10:17am'
    };
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
    const reposArray = [
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'QingCloud Private Repo',
        total: 40
      },
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'Kubernetes Public Repo',
        total: 4
      }
    ];
    const reposArray2 = [
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'Kube Stack Pek3a',
        total: 10
      },
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'Private Repo Beijing',
        total: 3
      },
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'Private Repo Beijing',
        total: 0
      }
    ];
    const appsArray = [
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'Kube Stack Pek3a',
        description:
          'MariaDB, the open source drop-in replacement for MySQL now available on Heroku',
        total: 435
      },
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'Redis Cloud',
        description:
          'MariaDB, the open source drop-in replacement for MySQL now available on Heroku',
        total: 321
      },
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'Storj',
        description:
          'MariaDB, the open source drop-in replacement for MySQL now available on Heroku',
        total: 233
      },
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'Heroku Redis',
        description:
          'MariaDB, the open source drop-in replacement for MySQL now available on Heroku',
        total: 99
      },
      {
        icon: 'http://via.placeholder.com/24x24',
        name: 'Redis To Go',
        description: '#1 Redis Provider with over 50,000 Redis instances.',
        total: 88
      }
    ];
    const clustersArray = [
      {
        icon: 'http://via.placeholder.com/16x16',
        name: 'Heroku Postgres',
        description: 'qingcloud alpha zw1',
        nodes: 2,
        time: '2 hours ago'
      },
      {
        icon: 'http://via.placeholder.com/16x16',
        name: 'Redis To Go',
        description: 'qingcloud alpha zw1',
        nodes: 6,
        time: '6 hours ago'
      },
      {
        icon: 'http://via.placeholder.com/16x16',
        name: 'ObjectRocket for MongoDB',
        description: 'qingcloud alpha zw1',
        nodes: 5,
        time: '10 hours ago'
      },
      {
        icon: 'http://via.placeholder.com/16x16',
        name: 'Heroku Postgres',
        description: 'qingcloud alpha zw1',
        nodes: 3,
        time: '18 hours ago'
      },
      {
        icon: 'http://via.placeholder.com/16x16',
        name: 'CloudKarafka',
        description: 'qingcloud alpha zw1',
        nodes: 2,
        time: '1 days ago'
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
              <LiRepos reposData={reposArray} reposType={'Public'} />
              <div className={styles.type}>Private</div>
              <LiRepos reposData={reposArray2} reposType={'Private'} />
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

import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';

import UserInfo from 'components/UserInfo';
import TotalCard from 'components/UserInfo/TotalCard';
import Panel from './Panel';
import AppList from './AppList';
import ClusterList from './ClusterList';
import RepoList from './RepoList';
import { Section } from 'components/Layout';
import Admin from 'components/Layout/Admin';
import { imgPlaceholder, getSessInfo, getLoginDate } from 'src/utils';

import styles from './index.scss';
import { toJS } from 'mobx/lib/mobx';

@inject(({ rootStore, sessInfo }) => ({
  appStore: rootStore.appStore,
  clusterStore: rootStore.clusterStore,
  repoStore: rootStore.repoStore,
  categoryStore: rootStore.categoryStore,
  userStore: rootStore.userStore,
  sessInfo
}))
@observer
export default class Overview extends React.Component {
  static async onEnter({ appStore, clusterStore, repoStore, categoryStore, userStore }) {
    await appStore.fetchAll();
    await clusterStore.fetchAll();
    await repoStore.fetchAll();
    await categoryStore.fetchAll();
    await userStore.fetchAll();
  }

  handleClickTotalCard = label => {
    this.props.history.push(`/dashboard/${label.toLowerCase()}`);
  };

  render() {
    const { appStore, clusterStore, repoStore, categoryStore, userStore, sessInfo } = this.props;
    const countLimit = 5;

    const appList = appStore.apps.slice(0, countLimit);
    const clusterList = clusterStore.clusters.slice(0, countLimit);
    //const repoList = repoStore.repos.toJSON();
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
      <Admin>
        <Section>
          <UserInfo {...userInfo} />
          {Object.keys(summary).map(label => (
            <TotalCard
              name={label}
              total={summary[label]}
              key={label}
              onClick={this.handleClickTotalCard.bind(this, label)}
            />
          ))}
        </Section>

        <Section className={styles.listOuter}>
          <Panel title="Top Repos" linkTo="/dashboard/repos">
            <RepoList repos={repoList} type="public" />
            <RepoList repos={repoList} type="private" limit={2} />
          </Panel>

          <Panel title="Top Apps" linkTo="/dashboard/apps">
            <AppList apps={appList} />
          </Panel>

          <Panel title="Latest Clusters" linkTo="/dashboard/clusters">
            <ClusterList clusters={clusterList} />
          </Panel>
        </Section>
      </Admin>
    );
  }
}

import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import UserInfo from 'components/UserInfo';
import TotalCard from 'components/UserInfo/TotalCard';
import Panel from './Panel';
import AppList from './AppList';
import ClusterList from './ClusterList';
import RepoList from './RepoList';
import Layout from 'components/Layout/Admin';
import { LayoutLeft, LayoutRight, Section } from 'components/Layout';
import Icon from 'components/Base/Icon';
import { imgPlaceholder, getSessInfo, getLoginDate } from 'src/utils';
import styles from './index.scss';

@translate()
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
    const { appStore, clusterStore, repoStore, categoryStore, userStore, sessInfo, t } = this.props;
    const countLimit = 5;

    const appList = appStore.apps.slice(0, countLimit);
    const repoList = repoStore.getRepoApps(repoStore.repos, appStore.apps);
    const clusterList = clusterStore.clusters.slice(0, countLimit);

    const userInfo = {
      name: getSessInfo('user', sessInfo),
      role: getSessInfo('role', sessInfo),
      loginInfo: getLoginDate(getSessInfo('last_login', sessInfo))
    };

    const summary = {
      Apps: appStore.totalCount,
      Clusters: clusterStore.totalCount,
      Categories: categoryStore.categories.length
      //Users: userStore.totalCount
    };
    const iconName = {
      Apps: 'appcenter',
      Clusters: 'cluster',
      Categories: 'components'
      //Users: 'group'
    };

    return (
      <Layout>
        <Section>
          <LayoutLeft column={4}>
            <UserInfo {...userInfo} />
          </LayoutLeft>
          {Object.keys(summary).map(label => (
            <LayoutLeft column={2} key={label}>
              <TotalCard
                name={label}
                iconName={iconName[label]}
                total={summary[label]}
                onClick={this.handleClickTotalCard.bind(this, label)}
              />
            </LayoutLeft>
          ))}
          <LayoutRight column={2}>
            <TotalCard
              name={`Users`}
              iconName={`group`}
              total={userStore.totalCount}
              onClick={this.handleClickTotalCard.bind(this, 'users')}
            />
          </LayoutRight>
        </Section>

        <LayoutLeft column={4}>
          <Panel
            title={t('Top Apps')}
            linkTo="/dashboard/apps"
            len={appList.length}
            iconName="appcenter"
          >
            <AppList apps={appList} />
          </Panel>
        </LayoutLeft>
        <LayoutLeft column={4}>
          <Panel
            title={t('Top Repos')}
            linkTo="/dashboard/repos"
            len={repoList.length}
            iconName="stateful-set"
          >
            <RepoList repos={repoList} type="public" limit={2} />
            <RepoList repos={repoList} type="private" limit={2} />
          </Panel>
        </LayoutLeft>
        <LayoutRight column={4}>
          <Panel
            title={t('Latest Clusters')}
            linkTo="/dashboard/clusters"
            len={clusterList.length}
            iconName="cluster"
          >
            <ClusterList clusters={clusterList} />
          </Panel>
        </LayoutRight>
      </Layout>
    );
  };

  normalOverview = () => {
    const { sessInfo, appStore, repoStore, clusterStore, t } = this.props;
    const countLimit = 3;

    const name = getSessInfo('user', sessInfo);

    const appList = appStore.apps.slice(0, countLimit);
    const repoList = repoStore.getRepoApps(repoStore.repos, appStore.apps);
    const clusterList = clusterStore.clusters.slice(0, countLimit);

    return (
      <Layout>
        <section className={styles.userInfo}>
          <div className={styles.userName}>{t('greet words', { name })}</div>
          <div className={styles.hello}>Welcome to OpenPitirx, What would you like to do?</div>
        </section>

        <LayoutLeft column={4}>
          <Panel title={t('Top Apps')} linkTo="/apps" len={appList.length} iconName="appcenter">
            <AppList apps={appList} />
          </Panel>
        </LayoutLeft>
        <LayoutLeft column={4}>
          <Panel
            title={t('Top Repos')}
            linkTo="/dashboard/repos"
            len={repoList.length}
            iconName="stateful-set"
          >
            <RepoList repos={repoList} type="public" limit={2} />
            <RepoList repos={repoList} type="private" limit={2} />
          </Panel>
        </LayoutLeft>
        <LayoutRight column={4}>
          <Panel
            title={t('Latest Clusters')}
            linkTo="/dashboard/clusters"
            len={clusterList.length}
            iconName="cluster"
          >
            <ClusterList clusters={clusterList} />
          </Panel>
        </LayoutRight>
      </Layout>
    );
  };

  devlopOverview = () => {
    const { appStore, clusterStore, repoStore, categoryStore, userStore, sessInfo, t } = this.props;
    const countLimit = 5;

    const appList = appStore.apps.slice(0, countLimit);
    const clusterList = clusterStore.clusters.slice(0, countLimit);

    return (
      <Layout>
        <Section>
          <LayoutLeft column={4}>
            <UserInfo {...userInfo} />
          </LayoutLeft>
          <LayoutLeft column={4}>
            <TotalCard
              name={`Private Repo`}
              iconName={`cloud`}
              iconSize={64}
              total={repoStore.totalCount}
              onClick={this.handleClickTotalCard.bind(this, 'repos')}
            />
          </LayoutLeft>
          <LayoutRight column={4}>
            <TotalCard
              name={`Runtimes`}
              iconName={`stateful-set`}
              iconSize={64}
              total={runtimeStore.totalCount}
              onClick={this.handleClickTotalCard.bind(this, 'runtimes')}
            />
          </LayoutRight>
        </Section>

        <LayoutLeft column={4}>
          <Panel
            title={t('Top Apps')}
            linkTo="/dashboard/apps"
            len={appList.length}
            iconName="apps"
          >
            <AppList apps={appList} />
          </Panel>
        </LayoutLeft>
        <LayoutRight column={8}>
          <Panel
            title={t('Latest Clusters')}
            linkTo="/dashboard/clusters"
            len={clusterList.length}
            iconName="clusters"
          >
            <ClusterList clusters={clusterList} />
          </Panel>
        </LayoutRight>
      </Layout>
    );
  };

  render() {
    const role = getSessInfo('role', this.props.sessInfo);
    return role === 'admin' ? this.adminOverview() : this.normalOverview();
  }
}

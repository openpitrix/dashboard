import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import Layout, { Grid, Section, Row, NavLink } from 'components/Layout';
import Status from 'components/Status';
import TdName, { ProviderName } from 'components/TdName';
import { Table } from 'components/Base';
import { formatTime, getSessInfo, getObjName, getPastTime } from 'src/utils';

import UserInfo from './UserInfo';
import TotalCard from './TotalCard';
import Panel from './Panel';
import AppList from './AppList';
import RepoList from './RepoList';
import ClusterList from './ClusterList';

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
    runtimeStore,
    categoryStore,
    userStore,
    loginUser
  }) {
    await appStore.fetchAll({ noLimit: true });
    await clusterStore.fetchAll();
    await runtimeStore.fetchAll();

    //fixme developer user query public repos
    if (loginUser.isDev || loginUser.isAdmin) {
      const params = loginUser.isDev ? { visibility: ['private'] } : {};
      await repoStore.fetchAll(params);
    }

    if (loginUser.isAdmin) {
      await categoryStore.fetchAll();
      await userStore.fetchAll();
    }
  }

  constructor(props) {
    super(props);
    const { appStore, clusterStore, runtimeStore, repoStore } = this.props;
    appStore.loadPageInit();
    clusterStore.loadPageInit();
    runtimeStore.loadPageInit();
    repoStore.loadPageInit();
    this.userInfo = {
      name: getSessInfo('user', props.sessInfo),
      role: getSessInfo('role', props.sessInfo),
      loginInfo: getSessInfo('last_login', props.sessInfo)
    };
  }

  handleClickTotalCard = label => {
    this.props.history.push(`/dashboard/${label.toLowerCase()}`);
  };

  adminView = () => {
    const { appStore, clusterStore, repoStore, categoryStore, userStore, t } = this.props;
    const countLimit = 5;

    const { isLoading } = appStore;
    const appList = appStore.apps.slice(0, countLimit);
    const repoList = repoStore.getRepoApps(repoStore.repos, appStore.apps);
    const clusterList = clusterStore.clusters.slice(0, countLimit);

    const summary = {
      Apps: appStore.totalCount,
      Clusters: clusterStore.totalCount,
      Categories: categoryStore.categories.length,
      Users: userStore.totalCount
    };
    const iconName = {
      Apps: 'appcenter',
      Clusters: 'cluster',
      Categories: 'components',
      Users: 'group'
    };

    return (
      <Layout isLoading={isLoading}>
        <NavLink>
          {t('Dashboard')} / {t('Overview')}
        </NavLink>

        <Row>
          <Grid>
            <Section>
              <UserInfo {...this.userInfo} />
            </Section>

            {Object.keys(summary).map(label => (
              <Section size={2} key={label}>
                <TotalCard
                  name={label}
                  iconName={iconName[label]}
                  total={summary[label]}
                  onClick={this.handleClickTotalCard.bind(this, label)}
                />
              </Section>
            ))}
          </Grid>
        </Row>

        <Row>
          <Grid>
            <Section>
              <Panel
                type="repo"
                title="Top Repos"
                linkTo="/dashboard/repos"
                buttonTo="/dashboard/repo/create"
                len={repoList.length}
              >
                <RepoList repos={repoList} type="public" limit={4} />
                <RepoList repos={repoList} type="private" limit={4} />
              </Panel>
            </Section>

            <Section>
              <Panel
                type="app"
                title="Top Apps"
                linkTo="/dashboard/apps"
                len={appList.length}
                isAdmin
              >
                <AppList apps={appList} />
              </Panel>
            </Section>

            <Section>
              <Panel
                type="cluster"
                title="Latest Clusters"
                linkTo="/dashboard/clusters"
                len={clusterList.length}
              >
                <ClusterList clusters={clusterList} />
              </Panel>
            </Section>
          </Grid>
        </Row>
      </Layout>
    );
  };

  normalView = () => {
    const { sessInfo, appStore, runtimeStore, clusterStore, t } = this.props;
    const countLimit = 5;
    const { isLoading } = appStore;

    const name = getSessInfo('user', sessInfo);
    const appList = appStore.apps.slice(0, countLimit);
    const runtimteList = runtimeStore.runtimes.slice(0, countLimit);
    const clusterList = clusterStore.clusters.slice(0, countLimit);

    return (
      <Layout isLoading={isLoading}>
        <Row>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{t('greet words', { name })}</div>
            <div className={styles.hello}>{t('NORMAL_GUIDING_WORDS')}</div>
          </div>
        </Row>
        <Grid>
          <Section>
            <Panel type="app" title="Top Apps" linkTo="/apps" len={appList.length}>
              <AppList apps={appList} />
            </Panel>
          </Section>

          <Section>
            <Panel
              type="runtime"
              title="Top Runtimes"
              linkTo="/runtimes"
              buttonTo="/dashboard/runtime/create"
              len={runtimteList.length}
            >
              <RepoList type="runtime" runtimes={runtimteList} clusters={clusterStore.clusters} />
            </Panel>
          </Section>

          <Section>
            <Panel
              type="cluster"
              title="Latest Clusters"
              linkTo="/dashboard/clusters"
              len={clusterList.length}
            >
              <ClusterList clusters={clusterList} />
            </Panel>
          </Section>
        </Grid>
      </Layout>
    );
  };

  developerView = () => {
    const { appStore, clusterStore, repoStore, runtimeStore, t } = this.props;
    const countLimit = 5;
    const { isLoading } = appStore;

    const appList = appStore.apps.slice(0, countLimit);
    const clusterList = clusterStore.clusters.slice(0, countLimit);

    const columns = [
      {
        title: 'Cluster Name',
        key: 'name',
        render: item => (
          <TdName
            name={item.name}
            description={item.cluster_id}
            linkUrl={`/dashboard/cluster/${item.cluster_id}`}
          />
        )
      },
      {
        title: 'Status',
        key: 'status',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: 'App',
        key: 'app_id',
        width: '100px',
        render: item => (
          <Link to={`/dashboard/app/${item.app_id}`}>
            {getObjName(appStore.apps, 'app_id', item.app_id, 'name')}
          </Link>
        )
      },
      {
        title: 'Runtime',
        key: 'runtime_id',
        render: item => (
          <Link to={`/dashboard/runtime/${item.runtime_id}`}>
            <ProviderName
              name={getObjName(runtimeStore.runtimes, 'runtime_id', item.runtime_id, 'name')}
              provider={getObjName(
                runtimeStore.runtimes,
                'runtime_id',
                item.runtime_id,
                'provider'
              )}
            />
          </Link>
        )
      },
      {
        title: 'Node Count',
        key: 'node_count',
        width: '60px',
        render: item => (item.cluster_node_set && item.cluster_node_set.length) || 0
      },
      {
        title: 'Updated At',
        key: 'status_time',
        width: '100px',
        render: item => <div className={styles.statusTime}>{getPastTime(item.status_time)}</div>
      }
    ];
    const pagination = {
      tableType: 'Clusters',
      onChange: () => {},
      total: countLimit,
      current: 1
    };

    return (
      <Layout isLoading={isLoading}>
        <NavLink>
          {t('Dashboard')} / {t('Overview')}
        </NavLink>

        <Row>
          <Grid>
            <Section>
              <UserInfo {...this.userInfo} />
            </Section>

            <Section>
              <TotalCard
                name={`Private Repo`}
                iconName={`cloud`}
                iconSize={64}
                total={repoStore.repos.length}
                onClick={this.handleClickTotalCard.bind(this, 'repos')}
              />
            </Section>
            <Section>
              <TotalCard
                name={`Runtimes`}
                iconName={`stateful-set`}
                iconSize={64}
                total={runtimeStore.totalCount}
                onClick={this.handleClickTotalCard.bind(this, 'runtimes')}
              />
            </Section>
          </Grid>
        </Row>

        <Row>
          <Grid>
            <Section>
              <Panel type="app" title="Top Apps" linkTo="/dashboard/apps" len={appList.length}>
                <AppList apps={appList} />
              </Panel>
            </Section>

            <Section size={8}>
              <Panel
                type="cluster"
                title="Latest Clusters"
                linkTo="/dashboard/clusters"
                len={clusterList.length}
                iconName="cluster"
              >
                <Table columns={columns} dataSource={clusterList} pagination={pagination} />
              </Panel>
            </Section>
          </Grid>
        </Row>
      </Layout>
    );
  };

  render() {
    const role = getSessInfo('role', this.props.sessInfo);

    if (role === 'global_admin') {
      return this.adminView();
    }
    if (role === 'developer') {
      return this.developerView();
    }
    return this.normalView();
  }
}

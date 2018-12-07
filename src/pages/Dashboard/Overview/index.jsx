import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import _ from 'lodash';

import Layout, {
  Grid, Section, Row, BreadCrumb
} from 'components/Layout';
import Status from 'components/Status';
import TdName, { ProviderName } from 'components/TdName';
import { Table } from 'components/Base';
import { getObjName, getPastTime } from 'src/utils';

import UserInfo from './UserInfo';
import TotalCard from './TotalCard';
import Panel from './Panel';
import AppList from './AppList';
import RepoList from './RepoList';
import ClusterList from './ClusterList';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  clusterStore: rootStore.clusterStore,
  repoStore: rootStore.repoStore,
  categoryStore: rootStore.categoryStore,
  userStore: rootStore.userStore,
  runtimeStore: rootStore.runtimeStore,
  user: rootStore.user
}))
@observer
export default class Overview extends React.Component {
  constructor(props) {
    super(props);
    const { user, history } = this.props;

    if (user.isDev) {
      history.replace('/dashboard/apps/mine');
    }

    this.userInfo = {
      username: user.username,
      role: user.role,
      loginInfo: user.loginTime
    };
    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    const {
      appStore,
      clusterStore,
      repoStore,
      runtimeStore,
      categoryStore,
      userStore,
      user
    } = this.props;
    if (user.isAdmin) {
      // query top repos
      await appStore.fetchStatistics();
      const topRepoIds = _.get(appStore, 'summaryInfo.topRepos', []).map(
        item => item.id
      );
      // query top apps, cluster number
      await clusterStore.fetchStatistics();
      const topAppIds = _.get(clusterStore, 'summaryInfo.topApps', []).map(
        item => item.id
      );
      // query latest clusters
      await clusterStore.fetchAll({
        cluster_type: 0,
        limit: 5
      });
      // query app total, top apps name
      await appStore.fetchAll({ app_id: topAppIds });
      // query app total, top repos name
      await repoStore.fetchAll({
        repo_id: topRepoIds,
        status: ['active', 'deleted']
      });
      // query category total
      await categoryStore.fetchAll({ limit: 1 });
      // query user total
      await userStore.fetchAll({ limit: 1 });
    }

    if (user.isNormal) {
      await appStore.fetchAll({ limit: 5 });
      await runtimeStore.fetchAll({ limit: 5 });
      await clusterStore.fetchAll({ noLimit: true });
    }

    if (user.isDev) {
      await repoStore.fetchAll({ visibility: ['private'], limit: 1 });
      await runtimeStore.fetchAll({ noLimit: true });
      await appStore.fetchAll({ limit: 5 });
      await clusterStore.fetchAll({ limit: 5 });
    }
    this.setState({ isLoading: false });
  }

  componentWillUnmount() {
    const {
      appStore, clusterStore, runtimeStore, repoStore
    } = this.props;

    appStore.reset();
    clusterStore.reset();
    runtimeStore.reset();
    repoStore.reset();
  }

  handleClickTotalCard = label => {
    const { user } = this.props;

    if (user.isDev && label === 'runtimes') {
      this.props.history.push('/runtimes');
    } else {
      this.props.history.push(`/dashboard/${label.toLowerCase()}`);
    }
  };

  adminView = () => {
    const {
      appStore,
      clusterStore,
      repoStore,
      categoryStore,
      userStore
    } = this.props;
    const { isLoading } = this.state;

    const summary = {
      Apps: appStore.summaryInfo.appCount,
      Clusters: clusterStore.summaryInfo.clusterCount,
      Categories: categoryStore.totalCount,
      Users: userStore.totalCount
    };
    const iconName = {
      Apps: 'appcenter',
      Clusters: 'cluster',
      Categories: 'components',
      Users: 'group'
    };

    const topRepos = _.get(appStore, 'summaryInfo.topRepos', []);
    const topApps = _.get(clusterStore, 'summaryInfo.topApps', []);
    const latestClusters = clusterStore.clusters.slice(0, 5);

    return (
      <Layout isLoading={isLoading} className={styles.overview}>
        <BreadCrumb linkPath="Dashboard>Overview" />

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
                len={topRepos.length}
              >
                <RepoList
                  topRepos={topRepos}
                  repos={repoStore.repos}
                  type="repo"
                />
              </Panel>
            </Section>

            <Section>
              <Panel
                type="app"
                title="Top Apps"
                linkTo="/dashboard/apps"
                len={topApps.length}
                isAdmin
              >
                <AppList topApps={topApps} apps={appStore.apps} />
              </Panel>
            </Section>

            <Section>
              <Panel
                type="cluster"
                title="Latest Clusters"
                linkTo="/dashboard/clusters"
                len={latestClusters.length}
              >
                <ClusterList clusters={latestClusters} />
              </Panel>
            </Section>
          </Grid>
        </Row>
      </Layout>
    );
  };

  normalView = () => {
    const {
      appStore, runtimeStore, clusterStore, user, t
    } = this.props;
    const { isLoading } = appStore;

    const name = user.username;
    const appList = appStore.apps;
    const runtimteList = runtimeStore.runtimes;
    const clusterList = clusterStore.clusters.slice(0, 5);

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
            <Panel
              type="app"
              title="Latest Apps"
              linkTo="/store"
              len={appList.length}
            >
              <AppList apps={appList} />
            </Panel>
          </Section>

          <Section>
            <Panel
              type="runtime"
              title="My Runtimes"
              linkTo="/runtimes"
              buttonTo="/dashboard/runtime/create"
              len={runtimteList.length}
            >
              <RepoList
                type="runtime"
                runtimes={runtimteList}
                clusters={clusterStore.clusters}
              />
            </Panel>
          </Section>

          <Section>
            <Panel
              type="cluster"
              title="Latest Clusters"
              linkTo="/purchased"
              len={clusterList.length}
            >
              <ClusterList clusters={clusterList} isNormal />
            </Panel>
          </Section>
        </Grid>
      </Layout>
    );
  };

  developerView = () => {
    const {
      appStore, clusterStore, repoStore, runtimeStore
    } = this.props;
    const { isLoading } = appStore;

    const appList = appStore.apps;
    const clusterList = clusterStore.clusters;

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
        width: '80px',
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
              name={getObjName(
                runtimeStore.runtimes,
                'runtime_id',
                item.runtime_id,
                'name'
              )}
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
        width: '50px',
        render: item => (item.cluster_node_set && item.cluster_node_set.length) || 0
      },
      {
        title: 'Updated At',
        key: 'status_time',
        width: '80px',
        render: item => (
          <div className={styles.statusTime}>
            {getPastTime(item.status_time)}
          </div>
        )
      }
    ];
    const pagination = {
      tableType: 'Clusters',
      onChange: () => {},
      total: 5,
      current: 1
    };

    return (
      <Layout isLoading={isLoading} className={styles.overview}>
        <BreadCrumb linkPath="Dashboard>Overview" />

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
                total={repoStore.totalCount}
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
              <Panel
                type="app"
                title="Latest Apps"
                linkTo="/dashboard/apps"
                len={appList.length}
              >
                <AppList apps={appList} isDev />
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
                <Table
                  columns={columns}
                  dataSource={clusterList}
                  pagination={pagination}
                />
              </Panel>
            </Section>
          </Grid>
        </Row>
      </Layout>
    );
  };

  render() {
    const { isAdmin, isDev } = this.props.user;

    if (isAdmin) {
      return this.adminView();
    }
    if (isDev) {
      return this.developerView();
    }
    return this.normalView();
  }
}

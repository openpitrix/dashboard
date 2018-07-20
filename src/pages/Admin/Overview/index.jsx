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
import Layout, { Grid, Section, Row } from 'components/Layout';
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

  constructor(props) {
    super(props);

    this.userInfo = {
      name: getSessInfo('user', props.sessInfo),
      role: getSessInfo('role', props.sessInfo),
      loginInfo: getLoginDate(getSessInfo('last_login', props.sessInfo))
    };
  }
  handleClickTotalCard = label => {
    this.props.history.push(`/dashboard/${label.toLowerCase()}`);
  };

  adminView = () => {
    const { appStore, clusterStore, repoStore, categoryStore, userStore, t } = this.props;
    const countLimit = 5;

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
      <Layout>
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
                title={t('Top Apps')}
                linkTo="/dashboard/apps"
                len={appList.length}
                iconName="appcenter"
              >
                <AppList apps={appList} />
              </Panel>
            </Section>

            <Section>
              <Panel
                title={t('Top Repos')}
                linkTo="/dashboard/repos"
                len={repoList.length}
                iconName="stateful-set"
              >
                <RepoList repos={repoList} type="public" limit={2} />
                <RepoList repos={repoList} type="private" limit={2} />
              </Panel>
            </Section>

            <Section>
              <Panel
                title={t('Latest Clusters')}
                linkTo="/dashboard/clusters"
                len={clusterList.length}
                iconName="cluster"
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
    const { sessInfo, appStore, repoStore, clusterStore, t } = this.props;
    const countLimit = 3;

    const name = getSessInfo('user', sessInfo);
    const appList = appStore.apps.slice(0, countLimit);
    const repoList = repoStore.getRepoApps(repoStore.repos, appStore.apps);
    const clusterList = clusterStore.clusters.slice(0, countLimit);

    return (
      <Layout>
        <Row>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{t('greet words', { name })}</div>
            <div className={styles.hello}>Welcome to OpenPitirx, What would you like to do?</div>
          </div>
        </Row>
        <Grid>
          <Section>
            <Panel title={t('Top Apps')} linkTo="/apps" len={appList.length} iconName="appcenter">
              <AppList apps={appList} />
            </Panel>
          </Section>

          <Section>
            <Panel
              title={t('Top Repos')}
              linkTo="/dashboard/repos"
              len={repoList.length}
              iconName="stateful-set"
            >
              <RepoList repos={repoList} type="public" limit={2} />
              <RepoList repos={repoList} type="private" limit={2} />
            </Panel>
          </Section>

          <Section>
            <Panel
              title={t('Latest Clusters')}
              linkTo="/dashboard/clusters"
              len={clusterList.length}
              iconName="cluster"
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

    const appList = appStore.apps.slice(0, countLimit);
    const clusterList = clusterStore.clusters.slice(0, countLimit);

    return (
      <Layout>
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
                title={t('Top Apps')}
                linkTo="/dashboard/apps"
                len={appList.length}
                iconName="apps"
              >
                <AppList apps={appList} />
              </Panel>
            </Section>

            <Section size={8}>
              <Panel
                title={t('Latest Clusters')}
                linkTo="/dashboard/clusters"
                len={clusterList.length}
                iconName="clusters"
              >
                <ClusterList clusters={clusterList} />
              </Panel>
            </Section>
          </Grid>
        </Row>
      </Layout>
    );
  };

  render() {
    const role = getSessInfo('role', this.props.sessInfo);

    if (role === 'admin') {
      return this.adminView();
    }
    if (role === 'developer') {
      return this.developerView();
    }
    return this.normalView();
  }
}

import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { translate } from 'react-i18next';

import Layout, { Dialog, NavLink } from 'components/Layout';
import Toolbar from 'components/Toolbar';
import Loading from 'components/Loading';
import RepoList from './RepoList/index';
import { getScrollTop } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  repoStore: rootStore.repoStore,
  appStore: rootStore.appStore,
  user: rootStore.user
}))
@observer
export default class Repos extends Component {
  constructor(props) {
    super(props);
    const { repoStore, appStore } = this.props;
    repoStore.appStore = appStore;

    // repoStore.loadPageInit();
    // appStore.loadPageInit();
  }

  async componentDidMount() {
    const { repoStore, appStore, user } = this.props;

    window.scroll({ top: 0, behavior: 'auto' });
    window.onscroll = _.throttle(this.handleScroll, 200);

    repoStore.appStore = appStore;
    await repoStore.fetchAll(
      {
        noLimit: true,
        isQueryPublic: user.isDev
      },
      appStore
    );
  }

  componentWillUnmount() {
    window.onscroll = null;
  }

  handleScroll = async () => {
    const { repoStore, appStore } = this.props;
    const { repos, initLoadNumber } = repoStore;
    const len = repos.length;
    const loadDataHeight = 150 + 24;

    if (len <= initLoadNumber || repos[len - 1].apps) {
      return;
    }

    let scrollTop = getScrollTop();
    let loadNumber = parseInt(scrollTop / loadDataHeight);
    for (let i = initLoadNumber; i < len && i < initLoadNumber + loadNumber; i++) {
      if (!repos[i].appFlag) {
        repoStore.repos[i].appFlag = true;
        await appStore.fetchAll({ repo_id: repos[i].repo_id });
        repoStore.repos[i] = { total: appStore.totalCount, apps: appStore.apps, ...repos[i] };
      }
    }
  };

  listenToJob = async ({ op, rid, values = {} }) => {
    const { repoStore } = this.props;
    const { jobs } = repoStore;
    const repoIds = repoStore.repos.map(repo => repo.repo_id);

    const status = _.pick(values, ['status', 'transition_status']);
    // const logJobs = () => repoStore.info(`${op}: ${rid}, ${JSON.stringify(status)}`);

    if (op === 'create:repo') {
      // rid is repo_id
      jobs[rid] = status;
    }

    if (op === 'update:repo' && repoIds.includes(rid)) {
      await repoStore.fetchAll();
    }

    if (op === 'create:repo_event') {
      const { repo_id } = values;
      if (repo_id && _.has(jobs, repo_id)) {
        Object.assign(jobs[repo_id], { repo_event: rid });
      }
    }

    if (op === 'update:repo_event') {
      let repoId = _.findKey(jobs, item => item.repo_event === rid);
      if (!repoId) {
        return;
      }
      if (['successful', 'deleted'].includes(status.status)) {
        delete jobs[repoId];
        await repoStore.fetchAll();
      }
    }
  };

  renderHandleMenu = id => {
    const { t } = this.props;
    const { deleteRepoOpen } = this.props.repoStore;
    return (
      <div id={id} className="operate-menu">
        <Link to={`/dashboard/repo/${id}`}>{t('View detail')}</Link>
        <Link to={`/dashboard/repo/edit/${id}`}>{t('Modify Repo')}</Link>
        <span onClick={() => deleteRepoOpen(id)}>{t('Delete')}</span>
      </div>
    );
  };

  deleteRepoModal = () => {
    const { t } = this.props;
    const { showDeleteRepo, deleteRepoClose, deleteRepo } = this.props.repoStore;

    return (
      <Dialog
        title={t('Delete Repo')}
        visible={showDeleteRepo}
        onSubmit={deleteRepo}
        onCancel={deleteRepoClose}
      >
        {t('Delete Repo desc')}
      </Dialog>
    );
  };

  renderNavLink = () => {
    const { user, t } = this.props;
    const { isDev, isAdmin } = user;

    if (isAdmin) {
      return (
        <NavLink>
          {t('Platform')} / {t('Repos')}
        </NavLink>
      );
    }

    return (
      <NavLink>
        <Link to="/dashboard/apps">{t('All Apps')}</Link> / {t('Repos')}
      </NavLink>
    );
  };

  render() {
    const { t } = this.props;
    const {
      repos,
      isLoading,
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh
    } = this.props.repoStore;

    return (
      <Layout listenToJob={this.listenToJob}>
        {this.renderNavLink()}

        <Toolbar
          placeholder={t('Search Repo')}
          searchWord={searchWord}
          onSearch={onSearch}
          onClear={onClearSearch}
          onRefresh={onRefresh}
          withCreateBtn={{ name: t('Create'), linkTo: `/dashboard/repo/create` }}
        />

        <Loading isLoading={isLoading}>
          <RepoList visibility="public" repos={repos.toJSON()} actionMenu={this.renderHandleMenu} />
          <RepoList
            visibility="private"
            repos={repos.toJSON()}
            actionMenu={this.renderHandleMenu}
          />
        </Loading>

        {this.deleteRepoModal()}
      </Layout>
    );
  }
}

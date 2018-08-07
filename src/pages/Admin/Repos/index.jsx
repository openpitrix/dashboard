import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get, throttle } from 'lodash';

import { getScrollTop } from 'utils';
import Layout, { Dialog } from 'components/Layout';
import Toolbar from 'components/Toolbar';
import RepoList from './RepoList';
import Loading from 'components/Loading';

import styles from './index.scss';

@inject(({ rootStore, sock }) => ({
  rootStore,
  repoStore: rootStore.repoStore,
  appStore: rootStore.appStore,
  sock
}))
@observer
export default class Repos extends Component {
  static async onEnter({ repoStore, appStore }) {
    repoStore.appStore = appStore;
    await repoStore.fetchAll({}, appStore);
    //await appStore.fetchApps();
  }

  constructor(props) {
    super(props);
    this.props.repoStore.setSocketMessage();
  }

  componentDidMount() {
    window.scroll({ top: 0, behavior: 'auto' });
    window.onscroll = throttle(this.handleScroll, 200);
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

  listenToJob = async payload => {
    const { repoStore } = this.props;

    if (['repo'].includes(get(payload, 'resource.rtype'))) {
      await repoStore.fetchAll();
      // repo_event: create, update, delete
      repoStore.setSocketMessage(payload);
    }
  };

  renderHandleMenu = id => {
    const { deleteRepoOpen } = this.props.repoStore;
    return (
      <div id={id} className="operate-menu">
        <Link to={`/dashboard/repo/${id}`}>View repo detail</Link>
        <Link to={`/dashboard/repo/edit/${id}`}>Modify repo</Link>
        <span onClick={() => deleteRepoOpen(id)}>Delete Repo</span>
      </div>
    );
  };

  deleteRepoModal = () => {
    const { showDeleteRepo, deleteRepoClose, deleteRepo } = this.props.repoStore;

    return (
      <Dialog
        title="Delete Repo"
        visible={showDeleteRepo}
        onSubmit={deleteRepo}
        onCancel={deleteRepoClose}
      >
        Are you sure delete this Repo?
      </Dialog>
    );
  };

  render() {
    const {
      repos,
      isLoading,
      fetchQueryRepos,
      searchWord,
      onClearSearch,
      onRefresh,
      sockMessage
    } = this.props.repoStore;

    return (
      <Layout sockMessage={sockMessage} listenToJob={this.listenToJob}>
        <div className={styles.container}>
          <div className={styles.title}>Repos</div>

          <Toolbar
            placeholder="Search Repo Name"
            searchWord={searchWord}
            onSearch={fetchQueryRepos}
            onClear={onClearSearch}
            onRefresh={onRefresh}
            withCreateBtn={{ linkTo: `/dashboard/repo/create` }}
          />

          <Loading isLoading={isLoading}>
            <RepoList
              visibility="public"
              repos={repos.toJSON()}
              actionMenu={this.renderHandleMenu}
            />
            <RepoList
              visibility="private"
              repos={repos.toJSON()}
              actionMenu={this.renderHandleMenu}
            />
          </Loading>
        </div>
        {this.deleteRepoModal()}
      </Layout>
    );
  }
}
